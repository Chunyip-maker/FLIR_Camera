module Api
  class ProxyController < ApplicationController
    require 'net/http'

    def proxy_to_external_server
      
      url = URI.parse("http://203.101.230.232:6001/api/image/current")
      response = Net::HTTP.get_response(url)
      send_data response.body, type: 'image/jpeg', disposition: 'inline', binary:true
      
    end
  end
end
