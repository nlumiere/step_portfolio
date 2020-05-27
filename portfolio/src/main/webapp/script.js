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

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
    const greetings =
        ['Hello world!', '¡Hola Mundo!', '你好，世界！', 'Bonjour le monde!'];

    //declares necessary container to display greeting
    const greetingContainer = document.getElementById('greeting-container');
    let happy = false;
    
    //Loops until the user is happy with the greeting, then displays the greeting text
    while(!happy){
        // Pick a random greeting.
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];

        happy = confirm(greeting);
        
        //Just to remain in scope
        if(happy){
            greetingContainer.innerText = greeting;
        }
    }
}

function visitLink(s){
    window.location.href=s;
}


