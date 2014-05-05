class AddResultCalcToAnswer < ActiveRecord::Migration
  def change
    add_column :answers, :result_calc, :string
  end
end
