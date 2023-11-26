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
  name: string;

  @Column("text")
  description: string;

  @Column("timestamp", {
    nullable: true,
  })
  startDate: Date;

  @Column("timestamp", {
    nullable: true,
  })
  completedDate: Date;

  @Column("timestamp", {
    nullable: true,
  })
  dueDate: Date;

  @Column("timestamp", {
    nullable: true,
  })
  createdDate: Date;

  @Column("timestamp", {
    nullable: true,
  })
  updatedDate: Date;

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
