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

ActiveRecord::Schema.define(:version => 20140514002237) do

  create_table "answers", :force => true do |t|
    t.text     "body"
    t.integer  "question_id"
    t.string   "result_calc"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "answers", ["question_id"], :name => "index_answers_on_question_id"

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0, :null => false
    t.integer  "attempts",   :default => 0, :null => false
    t.text     "handler",                   :null => false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "group_members", :force => true do |t|
    t.integer  "user_id"
    t.integer  "group_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "group_members", ["group_id"], :name => "index_group_members_on_group_id"
  add_index "group_members", ["user_id"], :name => "index_group_members_on_user_id"

  create_table "groups", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "invitations", :force => true do |t|
    t.integer  "from_user_id", :null => false
    t.integer  "to_user_id",   :null => false
    t.text     "message",      :null => false
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "invitations", ["from_user_id"], :name => "index_invitations_on_from_user_id"
  add_index "invitations", ["to_user_id"], :name => "index_invitations_on_to_user_id"

  create_table "personality_types", :force => true do |t|
    t.string   "name"
    t.string   "small_info"
    t.text     "large_info"
    t.text     "as_colleague"
    t.text     "as_manager"
    t.text     "as_employee"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.string   "title"
    t.string   "nickname"
  end

  add_index "personality_types", ["title"], :name => "index_personality_types_on_title"

  create_table "questions", :force => true do |t|
    t.text     "body"
    t.integer  "quiz_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "questions", ["quiz_id"], :name => "index_questions_on_quiz_id"

  create_table "quizzes", :force => true do |t|
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

  create_table "user_quizzes", :force => true do |t|
    t.integer  "user_id"
    t.integer  "quiz_id"
    t.boolean  "started"
    t.boolean  "completed"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "user_quizzes", ["quiz_id"], :name => "index_user_quizzes_on_quiz_id"
  add_index "user_quizzes", ["user_id"], :name => "index_user_quizzes_on_user_id"

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
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.string   "large_image_url"
    t.integer  "personality_type_id"
    t.text     "connections"
    t.boolean  "account_active",      :default => false
  end

  add_index "users", ["personality_type_id"], :name => "index_users_on_personality_type_id"
  add_index "users", ["uid"], :name => "index_users_on_uid"

end
