json.(tip, :id, :relationship_type, :text, :score)
json.curr_user_vote(tip.vote_from_user(current_user.id))
