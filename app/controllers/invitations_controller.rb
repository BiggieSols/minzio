class InvitationsController < ApplicationController
  def show
  end

  def create
    @invitation = Invitation.new
  end

  def destroy
  end
end
