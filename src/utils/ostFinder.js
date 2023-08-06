
const ostFinder = async (themes)=>{

}

const extractEpsValues = async (strings) {
    const epsValues = [];
    const regex = /(?:eps )?(\d+)-(\d+)/g;
  
    for (const string of strings) {
      const matches = Array.from(string.matchAll(regex));
      for (const match of matches) {
        const epsStart = parseInt(match[1], 10);
        const epsEnd = parseInt(match[2], 10);
  
        // Check if the song already exists in epsValues
        const songIndex = epsValues.findIndex(song => song[0] === string);
        if (songIndex !== -1) {
          epsValues[songIndex][1].push([epsStart, epsEnd]);
        } else {
          epsValues.push([string, [[epsStart, epsEnd]]]);
        }
      }
    }
  
    return epsValues;
  }
  
  // Example array of strings
  const arrayOfStrings = [
    "15: \"We go! (ウィーゴー!)\" by Hiroshi Kitadani (eps 517-541, 543-589)",
    "16: \"Eternal Pose (エターナルポーズ)\" by Asia Engineer (eps 231-245)",
    "17: \"We go! (ウィーゴー!)\" by Hiroshi Kitadani (518-542, 544-590)",
  ];
  
  // Extract "eps" start and end values
  const result = extractEpsValues(arrayOfStrings);
  console.log(result);
  