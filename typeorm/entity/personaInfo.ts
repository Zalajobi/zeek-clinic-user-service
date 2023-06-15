import {Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import {Provider} from "./providers";
import {Admin} from "./admin";
import {profileInfoModelProps} from "../../types";

@Entity({
  name: 'personal_info'
})
export class PersonalInformation {

  constructor(data:profileInfoModelProps) {

  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true,
    unique: true
  })
  providerId?: string

  @Column({
    nullable: true,
    unique: true
  })
  adminId?: string

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

  @Column({
    nullable: true
  })
  middle_name: string

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

  @Column({
    nullable: true
  })
  zip_code: string

  @Column()
  nationality: string

  @Column({
    nullable: true
  })
  profile_pic: string

  @CreateDateColumn()
  created_at?: Date

  @CreateDateColumn()
  updated_at: Date

  // Relations
  @OneToOne(() => Provider)
  @JoinColumn()
  provider?: Provider

  @OneToOne(() => Provider)
  @JoinColumn()
  admin?: Admin
}