'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrainingSchema extends Schema {
  up () {
    this.create('trainings', (table) => {
      table.increments()
      table.string('name_training', 254).notNullable()
      table.string('description', 254).notNullable().unique()
      table.string('series', 80)
      table.integer('repetition', 80).notNullable()
      table.integer('mat_id', 254)
      table.float('interval', '', 2)
      table.timestamps()
    })
  }

  down () {
    this.drop('trainings')
  }
}

module.exports = TrainingSchema
