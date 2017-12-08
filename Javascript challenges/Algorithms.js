//Factorialize a number 
function factorialize(num) {
   if (num === 0) {return 1;
     }
  else {  
   return num <=1?num:num*factorialize(num-1);
  }
}
//Reverse a string 
function reverseStringRecursively(str) {
  var arr = str.split('');
  var ret = [];
  for (var i = 0; i< arr.length; i++) {
    ret[arr.length -1 -i] = arr[i];
  }
  return ret.join("");
}

// recursive version
function reverseString(str) {
  if (str.length <= 0) {
    console.log(str);
    return str;
  } else {
    
    return str.charAt(str.length -1) + reverseString(str.substring(0, str.length -1));   
  }
  
}
//Check if a string is a palindrome, strip the all all non-alphanumeric characters (punctuation, spaces and symbols)
function palindrome(str) {
  // Good luck!
  var validInput = str.replace(/[_\W]/g, '').toLowerCase();
   console.log(validInput);
  
    return palindromeWithValidInput(validInput);
  
}

function palindromeWithValidInput(str) {
  // Good luck!
  if (str.length <= 1) {
    return true;
  } else {
    return str.charAt(0) == str.charAt(str.length-1) && palindromeWithValidInput(str.substring(1, str.length - 1));
         
  }
  
}

//Find the longest word in a sentence
function findLongestWord(str) {
  var ret = str.split(' ');
  ret.sort(function(a, b){
    return b.length - a.length;
  });
  return ret[0].length;
}

//title Case a sentence 
function titleCaseAttempt(str) {

  var ret = str.split(' ');
  try {
    for (var i=0; i<ret.length; i++) {
   
      if (ret[i].length >= 1) {
        ret[i]= ret[i].replace(/\w+/, function(txt){ return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
       
                   });
         console.log(ret[i]);
        
      
      } else {
        throw "Sentence is malformed"; 

      }
      
    }
    } catch(e) {
      console.log("Error :" + e);
    }
  return ret.join(' ');
}

//The simple answer from stackflow
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//Return Largest Numbers in Arrays
function largestOfFour(arr) {
 //to do, check array length
 var ret = arr.map(function(item){
   //to do, check the element length before using index
    var largest =  item.sort(function(a,b){return b-a;})[0];
    //console.log(largest);
    return largest;
    }); 
    //console.log(ret);
  return ret;
}

//Confirm the Ending
function confirmEnding(str, target) {
  //check if the target length >= str length	
  return target === str.substr(-target.length);
}


//Repeat a string repeat a string
function repeatStringNumTimes(str, num) {
  // repeat after me
  if (num < 1) {
    return "";
  } else {
    return str.repeat(num);
  }
}


//Truncate a string
function truncateString(str, num) {
  // Clear out that junk in your trunk
  var dots = "...";
  if (str.length <= num) {
    return str;
  } else if (num <= 3) {
    return str.slice(0, num).concat(dots);
  } else 
  {
    return str.slice(0, (num-3)).concat(dots);
  }
  
}

//chunkArrayInGroups in size
function chunkArrayInGroups(arr, size) {
  //to do, validate the paramenters
  var ret = [];
  //chunk the array in question
  if (arr.length <= size) {
    return ret.push(arr);
  }
  for (var i = 0; i< arr.length; i+=size) {
    ret.push(arr.slice(i, i+size));
  }
   
  return ret;
}

//Return the remaining elements of an array after chopping off n elements from the head.
function slasher(arr, howMany) {
  //to do, validate the paramenters
  var ret = [];
  //chunk the array in question
  if (arr.length > howMany) {
    ret = arr.slice(howMany);
  }
   
  return ret;
}
//with splice instead of slice
function slasher(arr, howMany) {
  //to do, validate the paramenters
  //chunk the array in question
  arr.splice(0, howMany);
  return arr;
}

//Return true if the string in the first element of the array 
//contains all of the letters of the string in the second element of the array.
function mutation(arr) {
  //checke the length of array
  //when empty arry of only one element then return true
  if (arr.length < 2) {
    return true;
  } else {
    for(var i = 0; i < arr[1].length; i++) {
     
      if (arr[0].toLowerCase().indexOf(arr[1].toLowerCase().charAt(i)) < 0) {
        return false; 
      }
    }
  }
  return true;
}

//Remove all falsy values from an array.
function bouncer(arr) {
  return arr.filter(function(val){return Boolean(val).valueOf()});
  
}

//Remove all elements from the initial array that are of the same value as these arguments.
function destroyer(arr) {
    var args = Array.prototype.slice.call(arguments,1);
   console.log(args);
  
  console.log(arr);
    return arr.filter(function(val){
       console.log(val);
      return !args.some(function(element){
        console.log(element);
        console.log("val is :" + val);
        //console.log(val.typeOf());
        return element === val;
      });
    });
  
}

//Return the lowest index at which a value (second argument) should be inserted into an array 
//(first argument) once it has been sorted. The returned value should be a number.
function getIndexToIns(arr, num) {
  //just insert the num to the arr and sorted 
  //then return the index of the num
  //but this changes the arr and have to iterate through array anyway
  //so let's do something else  
  var index = arr.sort(function(a,b) {return a-b;}).findIndex(function(val){
    return val >= num;
  });  
  if (index < 0) {
    //num bigger than all elements in array
    return arr.length;
  } else {
    return index;    
  }
}

//takes a encoded string as input and returns a decoded string.
//converts a char to uppercase letter 
//A has an axii code 65
function fromAxiiToChar(match){
  return String.fromCharCode(65 + ((match.charCodeAt(0))%65+13)%26);
}

function rot13(str) { // LBH QVQ VG!
  //use regex to match all uppercase letters
  return str.replace(/[A-Z]/g, fromAxiiToChar);              
}
