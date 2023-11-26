import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "tasks" })
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  task: string;

  @Column("timestamp", {
    nullable: true,
  })
  createdAt: Date;

  @Column("timestamp", {
    nullable: true,
  })
  updatedAt: Date;

  @BeforeInsert()
  setCreatedTime() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedTime() {
    this.updatedAt = new Date();
  }
}
