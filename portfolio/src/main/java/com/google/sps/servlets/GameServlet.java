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
import com.google.gson.Gson;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/game")
public class GameServlet extends HttpServlet {

    Game game = new Game();
    Gson elements = new Gson();

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;");
        String json = elements.toJson(game);

        System.out.println(json);
        response.getWriter().println(json);
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //gets input from form
        game.moves = new ArrayList<Move>();


        Entity taskEntity = new Entity("Task");
        taskEntity.setProperty("white", request.getParameter("p1"));
        taskEntity.setProperty("black", request.getParameter("p2"));
        taskEntity.setProperty("result", request.getParameter("outcome"));
        taskEntity.setProperty("moves", request.getParameter("moves"));

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(taskEntity);

        // Redirect back to the HTML page.
        response.sendRedirect("/game.html");
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
