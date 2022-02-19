document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("project2 JS imported successfully!");
  },
  false
);



const people = [
  { name: 'adri'},
  { name: 'becky'},
  { name: 'chris'},
  { name: 'dillon'},
  { name: 'evan'},
  { name: 'frank'},
  { name: 'georgette'},
  { name: 'hugh'},
  { name: 'igor'},
  { name: 'jacoby'},
  { name: 'kristina'},
  { name: 'lemony'},
  { name: 'matilda'},
  { name: 'nile'},
  { name: 'ophelia'},
  { name: 'patrick'},
  { name: 'quincy'},
  { name: 'roslyn'},
  { name: 'solene'},
  { name: 'timothy'},
  { name: 'uff'},
  { name: 'violet'},
  { name: 'wyatt'},
  { name: 'x'},
  { name: 'yadri'},
  { name: 'zack'},
]

const searchInput = document.querySelector('.input')

searchInput.addEventListener("input", (e) => {
  let value = e.target.value

  if (value && value.trim().length > 0){
       value = value.trim().toLowerCase()

      //returning only the results of setList if the value of the search is included in the person's name
      setList(people.filter(person => {
          return person.name.includes(value)
      }))

    } 
})

function noResults(){
  // create an element for the error; a list item ("li")
  const error = document.createElement('li')
  // adding a class name of "error-message" to our error element
  error.classList.add('error-message')

  // creating text for our element
  const text = document.createTextNode('No results found. Sorry!')
  // appending the text to our element
  error.appendChild(text)
  // appending the error to our list element
  list.appendChild(error)
}

const clearButton = document.getElementById('clear')

clearButton.addEventListener("click", () => {
    // 1. write a function that removes any previous results from the page
})

// creating and declaring a function called "setList"
// setList takes in a param of "results"
function setList(results){

  for (const person of results){
      // creating a li element for each result item
      const resultItem = document.createElement('li')

      // adding a class to each item of the results
      resultItem.classList.add('result-item')

      // grabbing the name of the current point of the loop and adding the name as the list item's text
      const text = document.createTextNode(person.name)

      // appending the text to the result item
      resultItem.appendChild(text)

      // appending the result item to the list
      list.appendChild(resultItem)
  }
}