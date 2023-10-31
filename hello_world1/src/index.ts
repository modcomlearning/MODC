import { Canister, query, text, update, Void, nat16, float64, Opt, StableBTreeMap, Vec, Record } from 'azle';

// This is a global variable that is stored on the heap
let message = '';
let gift = '';
let bmi = 0;//set bmi to be zero
//define a database to store our data
let db = StableBTreeMap(text, text, 0);
//create a model to represent how our record is going to be save, K/V
const Entry = Record({
    key: text,
    value: text
});


export default Canister({
    // Query calls complete quickly because they do not go through consensus
    getMessage: query([], text, () => {
        return message;
    }),
    // Update calls take a few seconds to complete
    // This is because they persist state changes and go through consensus
    setMessage: update([text], Void, (newMessage) => {
        message = newMessage; // This change will be persisted
    }),
    //Lets try out some functions on this canister
    //we update a new Gift, This 
    setGift: update([text], text, (newGift) =>{
       gift = newGift
       return "Gift Updated Successfully"
    }),

    //get the saved gift
    getGift: query([], text, () => {
        return gift;
    }),

    getBMI: update([float64, float64], text, (weight, height) =>{
       bmi = parseFloat(weight) / (parseFloat(height) * parseFloat(height))
       if(bmi < 17){
            return "Your BMI is:  "+bmi+ "Underweight"
       }
       else if(bmi>=17 && bmi < 23){
            return "Your BMI is:  "+bmi+" Normal"
       }
       else {
            return "Your BMI is:  "+bmi+ " Overweight"
       }//students can do more logic in type script
      }),

    //About StabelBtreeMap
    //https://forum.dfinity.org/t/stablebtreemap-in-canisters/14210
    //Saving Key and Value
     get: query([text], Opt(text), (key) => {
           return db.get(key);
        }),
        set: update([text, text], Void, (key, value) => {
            db.insert(key, value);
        }),

        setMany: update([Vec(Entry)], Void, (entries) => {
        entries.forEach((entry) => {
            db.insert(entry.key, entry.value);
            });
        }),
      });
