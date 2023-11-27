import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "tasks" })
export class Task {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column("text")
  name: string;

  @ApiProperty()
  @Column("text")
  description: string;

  @ApiProperty()
  @Column("timestamp", {
    nullable: true,
  })
  startDate: Date;

  @ApiProperty()
  @Column("timestamp", {
    nullable: true,
  })
  completedDate: Date;

  @ApiProperty()
  @Column("timestamp", {
    nullable: true,
  })
  dueDate: Date;

  @ApiProperty()
  @Column("timestamp", {
    nullable: true,
  })
  createdDate: Date;

  @ApiProperty()
  @Column("timestamp", {
    nullable: true,
  })
  updatedDate: Date;

  @ApiProperty()
  @ManyToOne(
    () => User, 
    (user) => user.task, 
    { eager: true }
  )
  user: User;

  @BeforeInsert()
  setCreatedTime() {
    const date = new Date();
    this.createdDate = date;
    this.startDate = date;
  }

  @BeforeUpdate()
  setUpdatedTime() {
    this.updatedDate = new Date();
  }
}
