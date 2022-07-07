


import React from 'react'

export  function is_empty(value) {
    switch (value) {
        case "":
        case 0:
        case "0":
        case "NaN":
        case NaN:
        case null:
        case false:
        case undefined:
        case typeof this == "undefined":
          return true;
        default:
          return false;
      }
}
