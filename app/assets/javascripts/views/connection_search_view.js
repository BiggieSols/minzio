TeamProfile.Views.ConnectionSearchView = Backbone.View.extend({
  tagName: "span",

  template: JST['misc/connection_search'],
  spinnerTemplate: JST['misc/spinner'],

  events: {
    "click .reload-contacts":"reloadContacts",
    "mouseover .glyphicon-refresh":"showToolTip",
  },

  showToolTip: function(event) {
    $(event.currentTarget).tooltip('show');
  },

  reloadContacts: function() {
    var spinner = this.spinnerTemplate();
    this.$('.reload-contacts').html(spinner);
    var that = this;
    TeamProfile.currentUser.save({build_shadow: true}, {
      success: function() {
        that.render();
      }
    });
  },

  // needs to be overridden in subclasses
  initialize: function() {
    this.placeholder = "Add a group member...";
    this.width = "270px";
  },

  _renderAddMemberPopover: function() {
    var that = this;
    setTimeout(function() {
      if(that.model.get("members").length == 1) {
        var title = "Add a group member";
        var content = "Invite your LinkedIn connections to the group! <br/><div class='linkedin-warning'>Note: this will send a message via LinkedIn on your behalf</div>";
        var $container = that.$('.select2-search-field');

        console.log("container is below");
        console.log($container);

        if($container[0].clientWidth > 0) {
          $container.data("container", "body")
                    .data("toggle", "popover")
                    .data("placement", "bottom")
                    .data("content", content)
                    .data("title", title)
                    .data("html", true)
                    .popover('show', {html: true});
        }
      }
    }, 500);
    return this;
  },

  dropdownFormat: function(state) {
    return "<div class='row'><div class='col-xs-4'><img class='lazy friend-dropdown' src='" + state.url + "' class='dropdown-img'/></div><div class='col-xs-8 user-name-dropdown'>" + state.text  + "</div></div>";
  },


  _formAction: function(params) {
    // console.log("form is taking an action!");
    // params.item_id = $(event.currentTarget).closest(".item").data("id");
    params.group_id = $('.group-container').data("id");
    console.log(params);
    var groupMembership = new TeamProfile.Models.GroupMember(params);

    var that = this;
    groupMembership.save({}, {
      success: function() {
        console.log("group membership saved!");
        that.model.fetch();
      }
    });
    // rec = new GiftMe.Models.UserItemRecommendation(params);
    // rec.save();

    // userName = this.$('.select2-search-choice div').text();
    // GiftMe.dispatcher.trigger("recommendation", {userName: userName});

    this._clearForm();
  },

  render: function() {
    var renderedContent = this.template({users: TeamProfile.currentUser.get("connections")});
    this.$el.html(renderedContent);
    this._renderSelect2()._renderAddMemberPopover();
    return this;
  },

  chosenItemFormat: function(state) {
    return "<span data-id='" + state.id +"'/>" + state.text + "</span>";
  },

  _clearForm: function() {
    this.render();
    this.$('.select2-input').focus();
  },

  _generateSelect2Data: function() {
    var data = [];
    TeamProfile.currentUser.get("connections").models.forEach(function(user) {
      data.push({
        id: user.id,
        text: user.escape("name"),
        url: user.escape("image_url")
      });
    });
    return {results: data};
  },

  _identifyFieldChanges: function() {
    var that = this;
    this.$('.connection-selector').on("change", function(event) {
      params = {};
      params.user_id = that.$('.select2-search-choice div span').data("id");
      that._formAction(params);
    });
  },

  _renderSelect2: function() {
    this.$('.connection-selector').select2({
      data: this._generateSelect2Data(),
      minimumInputLength: 3,
      placeholder: this.placeholder,
      width: this.width,
      formatResult: this.dropdownFormat,
      formatSelection: this.chosenItemFormat,
      multiple: true
    });

    this.$('.select2-choice').css("padding", "0px 10px");
    this._identifyFieldChanges();
    return this;
  },
});