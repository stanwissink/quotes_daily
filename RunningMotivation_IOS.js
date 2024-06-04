// URL of your quotes JSON file on GitHub
const quotesUrl = "https://raw.githubusercontent.com/your-username/motivational-quotes/main/quotes.json"; // Replace this URL with your own

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

// Estimate the required font size based on the length of the quote
function estimateFontSize(text, maxWidth, maxHeight) {
  const baseFontSize = 16; // Starting font size
  const maxFontSize = 30; // Maximum font size
  const minFontSize = 10; // Minimum font size
  
  let fontSize = baseFontSize;
  let widget = new ListWidget();
  let quoteText = widget.addText(text);
  
  // Increase the font size until the text fits the widget dimensions
  while (fontSize <= maxFontSize) {
    quoteText.font = Font.boldSystemFont(fontSize);
    let textSize = quoteText.size();
    
    if (textSize.width <= maxWidth && textSize.height <= maxHeight) {
      fontSize++;
    } else {
      break;
    }
  }
  
  // Decrease the font size until the text fits the widget dimensions
  while (fontSize >= minFontSize) {
    quoteText.font = Font.boldSystemFont(fontSize);
    let textSize = quoteText.size();
    
    if (textSize.width <= maxWidth && textSize.height <= maxHeight) {
      return fontSize;
    } else {
      fontSize--;
    }
  }
  
  return fontSize;
}

// Create the widget
async function createWidget() {
  let quotes = await fetchQuotes(quotesUrl); // Fetch quotes from the online source
  let quote = getQuote(quotes);
  
  let widget = new ListWidget();
  widget.backgroundColor = backgroundColor;
  
  // Estimate the widget dimensions (for a medium widget)
  const maxWidth = 329;
  const maxHeight = 155;
  
  // Estimate the required font size to fit the widget
  let fontSize = estimateFontSize(quote, maxWidth, maxHeight);
  
  widget.addSpacer(); // Add spacer to center text vertically
  
  let quoteText = widget.addText(quote);
  quoteText.font = Font.boldSystemFont(fontSize); // Use the estimated font size
  quoteText.textColor = fontColor;
  quoteText.centerAlignText(); // Center align the text horizontally
  
  widget.addSpacer(); // Add spacer to center text vertically
  
  return widget;
}

// Run the script
if (config.runsInWidget) {
  const widget = await createWidget();
  Script.setWidget(widget);
} else {
  const widget = await createWidget();
  widget.presentMedium();
}
Script.complete();
