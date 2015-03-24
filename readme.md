Experiments/Nodebraco
=====================
*this is a total experiment, not close to production ready.*

**I am not sure this will ever become a 'thing' - it's more a see what would happen if. It is just an experiment and a tool for me to do some learning in NodeJs / Express , but if you are better at that then me, I would love to hear your thoughts, on how it might do stuff properly**     

A frontend renderer for the umbraco cache file written in NodeJs

Take the umbraco.config file from the app_data folder of a umbraco site, and attept to render it using nodeJs Express & Handlebars.

Currently very early one does some basic stuff 

- loads umbraco.config, into memory
- routes returns JSON for pages in umbraco
- uses views to find templates that match 
- *has a template mapping in templates.json*
- passes currentPage JSON to view so you can render values

So a template in handlebars might like:

    <h1>Homepage: {{currentPage.title}}</h1>
    
    <div class="content">
      {{{currentPage.bodyText}}}
    </div>
    
the project has a basic LocalGovStarterKit umbraco.config file in it, you would need to include your own (and build your own templates) if you wanted to see another sites data. 

needs lots of work not least:
----------------------------
- some form of umbracoHelper JS , to do all the children(), TypedContent stuff
- some querying thing
- more efficient node lookup
- an understanding of how partials might work for this in handlebars.
- file watching to reaload cache when umbraco.config changes. .. 
- security ?





