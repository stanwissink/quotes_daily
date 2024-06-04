// URL of your quotes JSON file on GitHub
const quotesUrl = "https://raw.githubusercontent.com/stanwissink/quotes_daily/main/quotes1.json"; // Replace this URL with your own

// Customizable colors
const backgroundColor = new Color("#002626"); // Set your desired background color
const fontColor = new Color("#FFC745"); // Set your desired font color
const fontSize = 16; // Set the font size

// Function to fetch quotes from the URL
async function fetchQuotes(url) {
  let req = new Request(url);
  let json = await req.loadJSON();
  return json.quotes; // Assumes the JSON has a "quotes" array
}

// Get the current quote based on the day
function getQuote(quotes) {
  const today = new Date(); // Get the current date
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24); // Calculate the day of the year
  const index = dayOfYear % quotes.length; // Use modulus to wrap around the array
  return quotes[index]; // Select the quote for the current day
}

// Create the widget
async function createWidget() {
  let quotes = await fetchQuotes(quotesUrl); // Fetch quotes from the online source
  let quote = getQuote(quotes);
  
  let widget = new ListWidget();
  widget.backgroundColor = backgroundColor;
  
  widget.addSpacer(); // Add spacer to center text vertically
  
  let quoteText = widget.addText(quote);
  quoteText.font = Font.boldSystemFont(fontSize); // Use a predefined font style and size
  quoteText.textColor = fontColor;
  quoteText.centerAlignText(); // Center align the text horizontally
  
  widget.addSpacer(); // Add spacer to center text vertically
  
  return widget;
}

// Run the script
let widget = await createWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}
Script.complete();
