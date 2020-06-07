'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GallerySchema extends Schema {
  up () {
    this.create('galleries', (table) => {
      table.increments()
      table.string('title',254)
      table.string('description',254)
      table.string('url',254).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('galleries')
  }
}

module.exports = GallerySchema
