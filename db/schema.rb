# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20140429205000) do

  create_table "answers", :force => true do |t|
    t.text     "body"
    t.string   "score"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "outcomes", :force => true do |t|
    t.string   "title_string"
    t.text     "details"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "question_answers", :force => true do |t|
    t.integer  "question_id"
    t.integer  "answer_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "question_answers", ["answer_id"], :name => "index_question_answers_on_answer_id"
  add_index "question_answers", ["question_id"], :name => "index_question_answers_on_question_id"

  create_table "questions", :force => true do |t|
    t.text     "body"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "test_outcomes", :force => true do |t|
    t.integer  "test_id"
    t.integer  "outcome_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "test_outcomes", ["outcome_id"], :name => "index_test_outcomes_on_outcome_id"
  add_index "test_outcomes", ["test_id"], :name => "index_test_outcomes_on_test_id"

  create_table "test_questions", :force => true do |t|
    t.integer  "test_id"
    t.integer  "question_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "test_questions", ["question_id"], :name => "index_test_questions_on_question_id"
  add_index "test_questions", ["test_id"], :name => "index_test_questions_on_test_id"

  create_table "tests", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "user_answers", :force => true do |t|
    t.integer  "user_id"
    t.integer  "answer_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "user_answers", ["answer_id"], :name => "index_user_answers_on_answer_id"
  add_index "user_answers", ["user_id"], :name => "index_user_answers_on_user_id"

  create_table "user_tests", :force => true do |t|
    t.integer  "user_id"
    t.integer  "test_id"
    t.boolean  "started"
    t.boolean  "finished"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "user_tests", ["test_id"], :name => "index_user_tests_on_test_id"
  add_index "user_tests", ["user_id"], :name => "index_user_tests_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "uid"
    t.string   "provider"
    t.string   "email"
    t.text     "description"
    t.string   "headline"
    t.string   "image_url"
    t.string   "location"
    t.string   "industry"
    t.string   "pub_profile"
    t.string   "access_token"
    t.string   "access_token_secret"
    t.string   "session_token"
    t.string   "password_digest"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  add_index "users", ["uid"], :name => "index_users_on_uid"

end
