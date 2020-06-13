'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlanSchema extends Schema {
  up () {
    this.create('plans', (table) => {
      table.increments()
      table.string('nomeplano', 254).notNullable()
      table.string('descricaoplano', 245).notNullable()
      table.decimal('valor', 15, 2).notNullable().defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('plans')
  }
}

module.exports = PlanSchema
