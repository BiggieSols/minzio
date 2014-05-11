class PersonalityTypesController < ApplicationController
  def index
    render json: PersonalityType.all
  end
end
