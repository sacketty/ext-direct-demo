class CreateOwners < ActiveRecord::Migration
  def change
    create_table :owners do |t|
      t.string :name
      t.string :address
      t.string :state

      t.timestamps
    end
  end
end
