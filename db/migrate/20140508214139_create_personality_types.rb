class CreatePersonalityTypes < ActiveRecord::Migration
  def change
    create_table :personality_types do |t|
      t.string :name
      t.string :small_info
      t.text :large_info
      t.text :as_colleague
      t.text :as_manager
      t.text :as_employee
      t.timestamps
    end
  end
end
