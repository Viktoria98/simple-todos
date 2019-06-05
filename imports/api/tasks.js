import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const tasks = new SQL.Collection(
  "tasks",
  "postgres://localhost/postgres"
);

if (Meteor.isServer) {
  tasks
    .createTable({ text: ["$string"], checked: ["$bool", { $default: false }] })
    .save();
}


Meteor.methods({
  "tasks.insert"(text) {
    check(text, String);
    
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    tasks
      .insert({
        text: text,
        checked: false,
        usersid: this.userId,
        createdAt: new Date()
      })
      .save();

      console.log(tasks);
  },

  "tasks.remove"(taskId) {
    check(taskId, String);

    const task = tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {

      throw new Meteor.Error("not-authorized");
    }

    tasks
      .remove()
      .where("id = ?", taskId)
      .save();
  },

  "tasks.setChecked"(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
  
      throw new Meteor.Error("not-authorized");
    }

    tasks
      .update({
        id: taskId,
        checked: !this.checked
      })
      .where("id = ?", this.id)
      .save();
  }
});

