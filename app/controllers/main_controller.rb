class MainController < ApplicationController
  def index
    res = []
    res << %(Ext.Ajax.extraParams = {authenticity_token: '#{form_authenticity_token}'}; // Rails' forgery protection)
    @script = res.join("\n")
  end
end
