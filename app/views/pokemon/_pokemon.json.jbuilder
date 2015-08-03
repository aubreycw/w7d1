json.extract! pokemon, :id, :attack, :defense, :image_url, :moves, :name, :poke_type

display_toys = display_toys || false
if display_toys
  json.toys @toys, partial: "toys/toy", as: :toy
end
