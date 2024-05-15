module Api
  class ProxyController < ApplicationController
    require 'net/http'

    def proxy_to_external_server
      
      url = URI.parse("http://203.101.230.232:6001/api/image/current")
      response = Net::HTTP.get_response(url)
      send_data response.body, type: 'image/jpeg', disposition: 'inline', binary:true
      
    end
    def upload_img_to_external_server
      url = URI.parse("http://203.101.230.232:5000/upload_image")
      http = Net::HTTP.new(url.host, url.port)
      request = Net::HTTP::Post.new(url.path, {'Content-Type' => 'application/json'})
      request.body = params.to_json

      response = http.request(request)
      render json: { status: response.code, body: JSON.parse(response.body) }
    end
  end
end
