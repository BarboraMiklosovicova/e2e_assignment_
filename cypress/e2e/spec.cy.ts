import {IOmdbResponse} from "../../src/ts/models/IOmdbResponse";
import {IMovie} from "../../src/ts/models/Movie";

let testData:IOmdbResponse = {Search:[    
  {Title: "Harry Potter and the Deathly Hallows: Part 2", Year: "2011", imdbID: "tt1201607", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNzU3NDg4NTAyNV5BMl5BanBnXkFtZTcwOTg2ODg1Mg@@._V1_SX300.jpg"},
  {Title: "Harry Potter and the Sorcerer's Stone", Year: "2001", imdbID: "tt0241527", Type: "movie", Poster: "https://m.media-amazon.com/images/I/51asM9eJMXL.jpg"}, 
  {Title: "Harry Potter and the Chamber of Secrets", Year: "2002", imdbID: "tt0295297", Type: "movie", Poster: "https://m.media-amazon.com/images/I/51lXKcsxWML._AC_.jpg"},
  {Title: "Harry Potter and the Prisoner of Azkaban", Year: "2004", imdbID: "tt0304141", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTY4NTIwODg0N15BMl5BanBnXkFtZTcwOTc0MjEzMw@@._V1_SX300.jpg"},
  {Title: "Harry Potter and the Goblet of Fire", Year: "2005", imdbID: "tt0330373", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTI1NDMyMjExOF5BMl5BanBnXkFtZTcwOTc4MjQzMQ@@._V1_SX300.jpg"},
  {Title: "Harry Potter and the Order of the Phoenix", Year: "2007", imdbID: "tt0373889", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTM0NTczMTUzOV5BMl5BanBnXkFtZTYwMzIxNTg3._V1_SX300.jpg"},
  {Title: "Harry Potter and the Deathly Hallows: Part 1", Year: "2010", imdbID: "tt0926084", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTQ2OTE1Mjk0N15BMl5BanBnXkFtZTcwODE3MDAwNA@@._V1_SX300.jpg"},
  {Title: "Harry Potter and the Half-Blood Prince", Year: "2009", imdbID: "tt0417741", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNzU3NDg4NTAyNV5BMl5BanBnXkFtZTcwOTg2ODg1Mg@@._V1_SX300.jpg"},
  
]};
/*let testData: IOmdbResponse= {Search:[

  {Title:"Harry Potter 1", imdbID:"1091", Type:"Fantasy",Poster:"url1", Year:"2001"},
  {Title:"Harry Potter 2", imdbID:"1092", Type:"Fantasy",Poster:"url2", Year:"2002"},
  {Title:"Harry Potter 3", imdbID:"1093", Type:"Fantasy",Poster:"url3", Year:"2003"},
]};*/

describe("testing todo application", () => {
  it("should find button", () => {
    cy.visit("http://localhost:1234/");
    cy.get("button").click();

    });

  it ("should be able to type", () => {
    cy.visit("http://localhost:1234/");
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");

    });

  it ("should be able to check the form id", () => {
      cy.visit("http://localhost:1234/");
      cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
      cy.get("form").should("have.a.id", "searchForm");
  
      });
  
  it ("should be able to click", () => {
    cy.visit("http://localhost:1234/");
    cy.get("button").contains("Sök");

    });
  
  it ("should be able to show error message when no input from user",() => {
    cy.visit("http://localhost:1234/");
    cy.get("button").contains("Sök").click();
    cy.get("div > p").contains("Inga sökresultat att visa");

    });
    
  });


  describe ("testing the container", () =>{
    
  it ("should be able to display movie", () => {
    cy.visit("http://localhost:1234/");
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("button").click();
    cy.get("div > h3:first").contains("Harry Potter");
    cy.get("div > img").should("have.length", 10);

    });
  
  it ("should be able to check name of the class", () =>{
    cy.visit("http://localhost:1234/");
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("button").click();
    cy.get("div").should("have.a.class", "movie");

    });

  describe ("should handle API data", () => {
    
    it("should get 10 divs from API-get", () => {
      cy.intercept("GET","http://omdbapi.com/*").as ("movies");
      cy.get("input").type("Harry Potter").clear();
      cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
      cy.get("button").contains("Sök");
      cy.get("button").click();
      cy.wait("@movies").its("request.url").should("contain", "s=Harry%20Potter");
      cy.get("div#movie-container > div").should("have.length", 10);
    })

    it("should fetch testData", () => {
      cy.intercept("GET","http://omdbapi.com/*",testData).as ("movies");
      cy.get("input").type("Harry Potter").clear();
      cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
      cy.get("button").contains("Sök");
      cy.get("button").click();
      cy.wait("@movies").its("request.url").should("contain", "Harry%20Potter");
    });

    it("should get 8 h3 headings, images, image-attrs", () => {
      cy.intercept("GET", "http://omdbapi.com/*", testData);
      cy.get("form").submit();
      cy.get("div.movie > img").should("have.length", 8);
      cy.get("div.movie > h3").should("have.length", 8);
      cy.get("img").should("have.attr", "src");
      cy.get("img").should("have.attr", "alt");
    });

    it("should get no results", () => {
      cy.intercept("GET", "http://omdbapi.com/*", {});
      cy.get("button").contains("Sök");
      cy.get("button").click();
      cy.get("div#movie-container > div").should("have.length", 0);
    });

    it("should get errormsg404", () => {
      cy.request({
      method: "GET",
      url: "http://omdbapi.com/?apikey=416ed51a&s=%",
      failOnStatusCode: false,    
    }).as("error");
    cy.get("@error").its("status").should("equal", 404);
    });

  })

  })


      
  

  