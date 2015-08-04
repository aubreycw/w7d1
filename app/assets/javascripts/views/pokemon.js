Pokedex.Views.Pokemon = Backbone.View.extend({
  initialize: function () {
    this.$pokeList = this.$el.find('.pokemon-list');
    this.$pokeDetail = this.$el.find('.pokemon-detail');
    this.$newPoke = this.$el.find('.new-pokemon');
    this.$toyDetail = this.$el.find('.toy-detail');
    this.pokemon = new Pokedex.Collections.Pokemon();
    var that = this;

    this.$pokeList.on("click", "li.poke-list-item", that.selectPokemonFromList.bind(that));
    this.$pokeDetail.on("click", "li.toy-list-item", that.selectToyFromList.bind(that));
    this.$newPoke.on("click", "button", that.submitPokemonForm.bind(that));
    console.log(this.$el.find(".selectx"));
  },

  addPokemonToList: function (pokemon){
    var item = $("<li class='poke-list-item' data-id="+pokemon.get("id")+">"+pokemon.get("name")+" of type "+pokemon.get("poke_type")+"</li>");
    this.$pokeList.append(item);
    this.pokemon.add(pokemon);
  },

  refreshPokemon: function () {
    var that = this;
    this.pokemon.fetch({
      success: function () {
        that.$pokeList.empty();
        that.pokemon.each(that.addPokemonToList.bind(that));
      }
    });
  },

  renderPokemonDetail: function (pokemon) {
    var that = this;
    var $div = $("<div class='detail'></div>");
    var $img = $("<img src="+pokemon.get("image_url")+">");
    var $ul = $("<ul class='toys'></ul>");
    $div.append($img);
    $div.append($ul);
    pokemon.fetch({
      success: function () {
        pokemon.toys().each(that.addToyToList.bind(that));
      }
    });
    for (var key in pokemon.attributes){
      if (key !== "image_url"){
        $div.append($("<p>" + key + ": " + pokemon.get(key) + "</p>"));
      }
    }
    this.$pokeDetail.empty();
    this.$pokeDetail.append($div);
  },

  selectPokemonFromList: function (event){
    var id = $(event.currentTarget).data('id');
    this.renderPokemonDetail(this.pokemon.get(id));
  },

  createPokemon: function (attributes, callback){
    console.log("getting into create pokemon");
    var pokemon = new Pokedex.Models.Pokemon(attributes);
    var that = this;
    pokemon.save({},{
      success: function () {
        that.pokemon.add(pokemon);
        that.addPokemonToList.bind(that)(pokemon);
        callback(pokemon);
      },
      errors: function () {
        console.log("FAIL");
      }
    });
  },

  submitPokemonForm: function (event){
    console.log("In function");
    event.preventDefault();
    var pokemon = this.$el.find("form.new-pokemon").serializeJSON();
    this.createPokemon(pokemon, this.renderPokemonDetail.bind(this));
    this.$el.find(".new-pokemon div").empty();
  },

  addToyToList: function (toy){
    // var toy = $(toy);
    var $li = $("<li class='toy-list-item' data-pid="+ toy.get("pokemon_id") + " data-tid=" + toy.get("id") + "></li>");
    $li.append($("<p>name: "+ toy.get("name") + "</p>"));
    $li.append($("<p>price: "+ toy.get("price") + "</p>"));
    $li.append($("<p>happiness: "+ toy.get("happiness") + "</p>"));
    this.$pokeDetail.find("ul.toys").append($li);
  },

  renderToyDetail: function (toy){
    var $div = $("<div class='detail'></div>");
    var $img = $("<img src="+toy.get("image_url")+">");
    var $form = $("<form></form>");
    //var $input = $("<input class='selectx' type='text' value='null'>");
    var $select = $("<select class='selectx' data-pokemon-id=" + toy.get("pokemon_id") + " data-toy-id=" + toy.get("id") + " ></select>");
    $form.append($select);
    this.pokemon.each(function (pokemon){
      var option = "<option value=" + pokemon.get("id");
      if (pokemon.id === toy.get("pokemon_id")){
        option += " selected";
      }
      option += ">" + pokemon.get("name") + "</option>";
      $select.append($(option));
    });

    $div.append($img);
    $div.append($form);
    this.$toyDetail.empty();
    this.$toyDetail.append($div);
    this.$el.find(".selectx").on('change', this.reassignToy.bind(this));
  },

  selectToyFromList: function (event){
    // var id = $(event.currentTarget).data('id');
    // this.renderPokemonDetail(this.pokemon.get(id));
    console.log("in toy from list");
    var pid = $(event.currentTarget).data('pid');
    var tid = $(event.currentTarget).data('tid');
    var pokemon = this.pokemon.get(pid);
    var toy = pokemon.toys().get(tid);
    this.renderToyDetail(toy);
  },

  reassignToy: function (event) {
    console.log($(event.currentTarget));
    var $dataPkmnId = $(event.currentTarget).data("pokemon-id");
    console.log($dataPkmnId);
    var $dataToyId = $(event.currentTarget).data("toy-id");
    console.log($dataToyId);
    var $newPokemonId = $(event.currentTarget).val();
    console.log($newPokemonId);
  },

});
