json.(tip, :id, :relationship_type, :text, :score, :anonymized_author_id, :anonymized_author_name)

json.curr_user_vote(tip.vote_from_user(current_user.id))
