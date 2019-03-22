const mapNumber = function(n, start1, stop1, start2, stop2) {
  var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  return newval;
};