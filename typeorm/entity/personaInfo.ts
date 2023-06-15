import {Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import {Provider} from "./providers";

@Entity({
  name: 'personal_info'
})
export class PersonalInformation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true
  })
  providerId: string

  @Column({
    // unique: true
  })
  phone: string

  @Column({
    nullable: false
  })
  first_name: string

  @Column({
    nullable: false
  })
  last_name: string

  @Column()
  title: string

  @Column()
  gender: string

  @Column()
  dob: Date

  @Column()
  address: string

  @Column()
  city: string

  @Column()
  state: string

  @Column()
  country: string

  @Column()
  zip_code: string

  @Column()
  nationality: string

  @Column()
  profile_pic: string

  @CreateDateColumn()
  created_at?: Date

  @CreateDateColumn()
  updated_at: Date

  // Relations
  @OneToOne(() => Provider)
  @JoinColumn()
  provider: Provider
}