# your-tab documentation
Your-tab uses JSON to build the newtab page, the syntax is easy to follow and understand. Your-tab is versatile and supports and suggests using Tailwind CSS whenever possible to make your elements easier to read and modify.

## Getting started
### Example Config
![image](https://github.com/user-attachments/assets/562554ba-b700-4acf-971d-5458065cc0e0)

```json
{
  "type": "root",
  "box_class": "bg-[#000000b0] backdrop-blur-md shadow-lg p-4",
  "body_class": "bg-[url(https://up.jooo.tech/1625)] bg-cover text-text font-body",
  "class": "flex flex-col items-center justify-center gap-4 h-screen w-screen",
  "children": [
    {
      "type": "greeting",
      "mode": "good_time_of_day",
      "class": "text-2xl font-bold text-white",
      "name": "User"
    },
    {
      "type": "container",
      "direction": "row",
      "children": [
        {
          "type": "container",
          "children": [
            {
              "type": "dropdown",
              "label": "Departures from Sandvika",
              "class": "p-0",
              "open": true,
              "box": true,
              "children": [
                {
                  "type": "html",
                  "tag": "iframe",
                  "src": "https://rtd.banenor.no/rtd.html#/?id=SV-RTD%2FDeparture&page=0&pageCount=1&hideNotice=false&noPassengerDisplay=false&header=false&wrapperName=landscape&display=rtd",
                  "width": "450px",
                  "height": "282px"
                }
              ]
            }
          ]
        },
        {
          "type": "container",
          "children": [
            {
              "type": "container",
              "box": true,
              "gap": 1,
              "children": [
                {
                  "type": "date",
                  "class": "text-2xl text-center",
                  "format": "DD MONTH_NAME YYYY"
                },
                {
                  "type": "time",
                  "class": "text-6xl font-bold text-center",
                  "format": "HH:MM:SS"
                }
              ]
            },
            {
              "type": "asset-graph",
              "ticker": "SOL",
              "background": "FFFFFF00",
              "src": "https://api.phantom.app/price-history/v1?token=solana%3A101%2FnativeToken%3A501&type=1D",
              "ws_stream": "wss://history.oraclesecurity.org/trading-view/stream",
              "ws_initiator": "{\"a\":\"subscribe\",\"ch\":[\"solusd\"]}",
              "ws_handler": "selector:p,multiplier:0.00000001"
            }
          ]
        }
      ]
    }
  ]
}
```

### All elements
#### root
Root element should be the first element and contains the box and body style.
> To set the wallpaper/background set the background using the body class
```json
{
  "type": "root",
  "box_class": "bg-[#10101040] shadow-lg p-4 backdrop-blur-sm rounded-xl border border-[#10101030]",
  "body_class": "bg-[url(https://up.pumping.lol/1625)] bg-cover text-text font-body",
  "class": "flex flex-col items-center justify-center gap-4 h-screen w-screen text-background",
  "children": [
    ...
  ]
}
```
```html
<body class="bg-[url(https://up.pumping.lol/1625)] bg-cover text-text font-body">
    <main id="content" class="flex flex-col items-center justify-center gap-4 h-screen w-screen text-background">
        ...
    </main>
</body>
```

#### container
Wrapper for flex `DIV` used to grouping/containing elements.

![image](https://github.com/user-attachments/assets/1ff7fc7a-58cf-415b-8938-742bd1f5f2bb)

```json
{
    "type": "container",
    "gap": 2, // gap - defaults to 4
    "direction": "row", // flex direction - defaults to col
    "height": "h-full", // height - defaults to `h-fit`

    "box": true, // adds the box styling defined the `root` element - defaults to false
    "padding": 2, // tailwind padding, only used if `box` is enabled - defaults to 4
    
    "children": [
        ...
    ]
}
```
```html
<div class="undefined h-full flex flex-row gap-2 p-2 ... (box classes)">
    ...
</div>
```

#### dropdown
Simple dropdown element to contain elements that are not always needed

![image](https://github.com/user-attachments/assets/9b7d8e03-919e-4309-91b2-7a4753b1f1f1)

```json
{
    "type": "dropdown",
    "label": "Departures from Sandvika", // Label for the dropdown - do not leave undefined
    "open": true, // if opened by defaults - defaults to false
    "box": true, // adds the box styling defined the `root` element - defaults to false
    "children": [
        ...
    ]
}
```
```html
<div class="dropdown h-full grow overflow-hidden bg-[#10101040] shadow-lg p-4 backdrop-blur-sm rounded-xl border border-[#10101030] " style="padding: 0px;">
  <div class="dropdown-toggle flex justify-between select-none cursor-pointer p-3">
    <h6>Departures from Sandvika</h6>
    <p class="dropdown-identifier" style="rotate: 90deg">&gt;</p>
  </div>
  <div class="dropdown-content bg-black overflow-hidden h-full grow h-fit">
    ...
  </div>
</div>
```

#### html
The simplest element, HTML element wrapper.

![image](https://github.com/user-attachments/assets/b1a49fee-f909-48e2-90f3-ede5b6773611)


```json
{
    "type": "html",
    "tag": "iframe", // tag type (e.g iframe, img, etc)
//  "content": "<a href=\"\">Test</a>", // content -> elm.innerHTML
    "src": "https://.../tron-wallet?embed=true", // all unrecongnized properties are set as the elements attribute
    "class": "bg-[#10101030] shadow-lg p-4 backdrop-blur-sm rounded-xl border border-[#10101030]"
}
```
```html
<iframe 
    class="bg-[#10101030] shadow-lg p-4 backdrop-blur-sm rounded-xl border border-[#10101030]"
    src="https://.../tron-wallet?embed=true"
>
    undefined
</iframe>
```

#### greeting
Simple greeting to the user.

![image](https://github.com/user-attachments/assets/a6ea526a-327e-4069-9c8e-2b2cf3e9db19)

```json
{
    "type": "greeting",
    "mode": "good_time_of_day", // type of greeting, defaults to just "Hello, %name%" if anything else
    "class": "text-2xl font-bold text-white",
    "name": "User"
}
```
```html
<p class="text-2xl font-bold text-white">Good evening, User!</p>
```

#### time
Time of day

![image](https://github.com/user-attachments/assets/155ff463-d118-4f70-a8db-8343119438ab)

```json
{
    "type": "time",
    "class": "text-6xl font-bold text-center",
    "format": "Its HH:MM:SS" // HH, MM, SS are available
}
```
```html
<p class="text-6xl font-bold text-center">
    Its 12:45:56
</p>
```

#### date
Date information

![image](https://github.com/user-attachments/assets/6255aa26-7116-4477-9bcb-e550729ab220)

```json
{
    "type": "date",
    "class": "text-2xl text-center",
    "format": "DD MONTH_NAME YYYY" // DD, WW, MM, YYYY, DAY_NAME, MONTH_NAME
//  "day_names", // Names of the days in a list - defaults to  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
}
```
```html
<p class="text-2xl text-center">01 February 2025</p>
```

#### asset-graph
Trading view chart of an asset 

![image](https://github.com/user-attachments/assets/7b717b1e-213a-4e21-b6c7-bf5945f24e69)

```json
{
    "type": "asset-graph",
    "ticker": "SOL",
    "background": "FFFFFF00", // background colour of the chart
    "text_color": "FFFFFF", // colour of the text of the chart
    "src": "https://api.phantom.app/price-history/v1?token=...1&type=1D", // historical data to load
    "ws_stream": "wss://history.oraclesecurity.org/trading-view/stream", // live price data source
    "ws_initiator": "{\"a\":\"subscribe\",\"ch\":[\"solusd\"]}", // payload to send on stream open
    "ws_handler": "selector:p,multiplier:0.00000001" // handler for the price updates, e.g p = parsed.p; solana.price = parsed.solana.price. multiplier = multiplier of the returned price
//  "class": "" // if not defined then box class is used
}
```
```html
<div class="relative h-full h-fit grow flex justify-center overflow-hidden bg-[#10101040] shadow-lg p-4 backdrop-blur-sm rounded-xl border border-[#10101030]">
  <p class="absolute top-3 left-3 z-10 font-bold">SOL / -3.66%</p>
  <div>
    <div class="tv-lightweight-charts" style="...">
      ...
    </div>
  </div>
</div>
```
