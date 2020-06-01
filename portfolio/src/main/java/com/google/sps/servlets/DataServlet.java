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

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html;");
        // response.getWriter().println("<p>Hello Nick!</p>");

        Game game = new Game("Nick", "Other Nick");
        game.moves.add(new Pair("f3", "e5"));
        game.moves.add(new Pair("g4", "Qh4#"));
        String json = convToJson(game);

        System.out.println(json);
        response.getWriter().println(json);
    }

    private String convToJson(Game game){
        String json = "";
        json += "{\n\"players\": [";
        json += "{\"p1\": \"" + game.players.first + "\", \"p2\": \"" + game.players.second;
        json += "\"}]\n\"moves\": [";
        for(Pair m : game.moves){
            json += "{\"white\": \"" + m.first + "\", \"black\": \"" + m.second + "\"}";
        }
        json += "]\n}";

        return json;
    }

}

class Pair{
    public String first;
    public String second;

    public Pair(){
        this.first = "";
        this.second = "";
    }

    public Pair(String a, String b){
        this.first = a;
        this.second = b;
    }
}

class Game{
    public ArrayList<Pair> moves;
    public Pair players;

    public Game(){
        this.moves = new ArrayList<Pair>();
    }

    public Game(String p1, String p2){
        this.moves = new ArrayList<Pair>();
        this.players.first = p1;
        this.players.second = p2;
    }
}
