require 'nokogiri'
require 'open-uri'
# require 'pry'
# require 'launchy'

# Get a Nokogiri::HTML::Document for the page we’re interested in...

# types = []
# ["i", "e"].each do |c1|
#   ["n", "s"].each do |c2|
#     ["t", "f"].each do |c3|
#       ["j", "p"].each do |c4|
#         types << c1 + c2 + c3 + c4
#       end
#     end
#   end
# end

# TEMP LINE
types = ['INTP']#, 'entj'].map(&:upcase)

long_form_hash = {"i" => "Introverted", "n" => "iNtuitive", "t" => "Thinking", "j" => "Judging", "e" => "Extraverted", "s" => "Sensing", "f" => "Feeling", "p" => "Perceiving"}


type_urls = types.map {|type| "http://www.16personalities.com/#{type}s-at-work"}

puts type_urls

type_details = {}

types.each do |type|
  url = "http://www.16personalities.com/#{type}s-at-work"
  doc = Nokogiri::HTML(open(url))
  type_details[type] = {}
  doc.css('h4').each do |header|
    traits = header.next_sibling.next_sibling.css("li").children.map(&:content)
    type_details[type][header.content] = traits
  end
end

# binding.pry

type_details.each do |type, details_hash|
  # puts "got here"
  colleagues = details_hash["#{type} colleagues"]
  managers = details_hash["#{type} managers"]
  employees = details_hash["#{type} subordinates"]
  small_info = type.split("").map {|char| long_form_hash[char.downcase]}.join(" ");
  # PersonalityType.create(name: type, as_colleague: colleagues, as_manager: managers, as_employee: employees, small_info: small_info)
  binding.pry
end

=begin


# Do funky things with it using Nokogiri::XML::Node methods...

####
# Search for nodes by css

personality_traits = {}
doc.css('h4').each do |header|
  puts header
  traits = header.next_sibling.next_sibling.css("li").children.map(&:content)
  personality_traits[header.content] = traits
end
  binding.pry

=end
# ####
# # Search for nodes by xpath
# doc.xpath('//h3/a').each do |link|
#   puts link.content
# end

# ####
# # Or mix and match.
# doc.search('h3.r a.l', '//h3/a').each do |link|
#   puts link.content
# end