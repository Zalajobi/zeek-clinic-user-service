import { Logger, QueryRunner } from 'typeorm';
import { QueryLog } from '@typeorm/entity/queryLog';
import { QueryLogType } from '@typeorm/entity/enums';
import { mutableConfig } from '@util/config';
import { AppDataSource } from '../../data-source';

export class CustomQueryLogger implements Logger {
  private async saveLog(
    query: string,
    logType: QueryLogType,
    parameters?: any[],
    queryRunner?: QueryRunner,
    error?: string
  ) {
    // Check conditions before logging
    if (!mutableConfig.TYPEORM_LOGGING_START) return;
    if (query.includes('queryLog')) return;
    if (query.includes('COMMIT')) return;
    if (query.includes('START TRANSACTION')) return;

    const requestUrl =
      queryRunner && queryRunner.data['request']
        ? '(' + queryRunner.data['request'].url + ') '
        : '';
    const queryLogRepository = AppDataSource.getRepository(QueryLog);
    const queryLog = new QueryLog();

    queryLog.error = error ?? '';
    queryLog.query = requestUrl + 'executing query: ' + query;
    if (parameters && parameters.length > 0) {
      queryLog.parameters = JSON.stringify(parameters);
    }
    queryLog.logType = logType;
    await queryLogRepository.save(queryLog);
  }

  async logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    await this.saveLog(query, QueryLogType.LOG, parameters, queryRunner);
  }

  async logQueryInfo(
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    await this.saveLog(query, QueryLogType.INFO, parameters, queryRunner);
  }

  async logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    await this.saveLog(
      query,
      QueryLogType.ERROR,
      parameters,
      queryRunner,
      error
    );
  }

  async logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    await this.saveLog(
      query,
      QueryLogType.SLOW,
      parameters,
      queryRunner,
      time.toString()
    );
  }

  async logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    await this.saveLog(message, QueryLogType.SCHEMA, [], queryRunner, '');
  }

  async logMigration(message: string, queryRunner?: QueryRunner) {
    await this.saveLog(message, QueryLogType.MIGRATION, [], queryRunner, '');
  }

  async log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner
  ) {
    const levelType =
      level === 'log'
        ? QueryLogType.LOG
        : level === 'info'
        ? QueryLogType.INFO
        : QueryLogType.WARN;
    await this.saveLog(message.toString(), levelType, [], queryRunner, '');
  }
}
