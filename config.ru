# This file is used by Rack-based servers to start the application.

#Middleware
use Rails::ExtJS::Direct::RemotingProvider, "/direct"

require ::File.expand_path('../config/environment',  __FILE__)
run Raptor::Application
