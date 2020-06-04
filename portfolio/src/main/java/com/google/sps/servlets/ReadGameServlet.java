// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import com.google.gson.Gson;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;

@WebServlet("/view-games")
public class ReadGameServlet extends HttpServlet {

    Game game = new Game();

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Query query = new Query("Task");

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        PreparedQuery results = datastore.prepare(query);

        List<Game> games = new ArrayList<>();
        for(Entity entity :results.asIterable()){
            game = new Game();
            game.white = (String)entity.getProperty("white");
            game.black = (String)entity.getProperty("black");
            game.result = (String)entity.getProperty("result");
            parseMoves((String)entity.getProperty("moves"));
            
            games.add(game);
        }

        Gson gson = new Gson();
        String json = gson.toJson(games);

        response.setContentType("application/json;");
        System.out.println(json);
        response.getWriter().println(json);
    }

    private void parseMoves(String moveList){
        String build = "";
        for(int ii = 0; ii < moveList.length(); ii++){
            if(moveList.charAt(ii) ==  ' '){
                if(game.moves.size() == 0){
                    game.moves.add(new Move(build, ""));
                }
                else if(game.moves.get(game.moves.size() - 1).second != ""){
                    game.moves.add(new Move(build, ""));
                }
                else{
                    game.moves.get(game.moves.size() - 1).second = build;
                }
                build = "";
            }
            else{
                build += moveList.charAt(ii);
            }
        }
        if(build != ""){
            if(game.moves.get(game.moves.size() - 1).second != ""){
                game.moves.add(new Move(build, ""));
            }
            else{
                game.moves.get(game.moves.size() - 1).second = build;
            }
        }
    }
}

class Move{
    public String first;
    public String second;

    public Move(){
        this.first = "";
        this.second = "";
    }

    public Move(String a, String b){
        this.first = a;
        this.second = b;
    }
}

class Game{
    public ArrayList<Move> moves = new ArrayList<Move>();
    public String white;
    public String black;
    public String result;

    public Game(){
    }

    public Game(String p1, String p2){
        this.white = p1;
        this.black = p2;
    }
}