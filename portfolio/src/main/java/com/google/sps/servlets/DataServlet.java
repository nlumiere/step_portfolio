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
import com.google.gson.Gson;
import java.util.ArrayList;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html;");
        response.getWriter().println("<p>Hello Nick!</p>");
    }
}

@WebServlet("/game")
public class DataServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html;");

        Game game = new Game("Nick", "Other Nick");
        game.moves.add("f3");
        game.moves.add("e5");
        game.moves.add("g4");
        game.moves.add("Qh4#");
        String json = convertToJsonUsingGson(game);

        response.getWriter().println(json);
    }

    private String convertToJsonUsingGson(Game game) {
        Gson gson = new Gson();
        String json = gson.toJson(game);
        return json;
    }
}

public class Pair{
    public String first;
    public String second;

    public Pair(){
        this.first = '';
        this.second = '';
    }

    public Pair(String a, String b){
        this.first = a;
        this.second = b;
    }
}

public class Game{
    public ArrayList<String> moves;
    public Pair players;

    public Game(){
        this.moves = new ArrayList<String>();
    }

    public Game(String p1, String p2){
        this.moves = new ArrayList<String>();
        this.players.first = p1;
        this.players.second = p2;
    }
}
