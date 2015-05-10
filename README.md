[The Mandelbrot Set](http://momchil-atanasov.com/mandelbrot/)
==========

![](https://travis-ci.org/momchil-atanasov/mandelbrot.svg?branch=master)

This project is an HTML5 web page showing the beauty of the Mandelbrot Set and fractals in general.

![](https://github.com/momchil-atanasov/mandelbrot/blob/master/screenshots/mandelbrot.png)

You can access the page on the following link: **[momchil-atanasov.com/mandelbrot/](http://momchil-atanasov.com/mandelbrot/)**

If that one doesn't work for some reason, you can try the following one: **[momchil-atanasov.github.io/mandelbrot/](http://momchil-atanasov.github.io/mandelbrot/)**

## Developer's Guide

The project has some JavaScript unit tests which are implemented through [Jasmine](http://jasmine.github.io/).

There were multiple choices for build frameworks that can run the Jasmine tests but in the end I chose the **Maven** one. I wanted to see how it performs and my impressions are that it is much more stable than the **Ruby/Rake** one which would result in regular **PhantomJS** crashes.

You can run the tests by executing the following command in the root of the project from your Terminal (You need to have Maven installed):

```bash
mvn clean verify
```

## License
The code is licensed under the terms in the `LICENSE` file. The design and the images that make up the page are licensed under the `CC Attribution 3.0 (CC BY 3.0)` license.

There are some open-source libraries that have been used in the project. Those have their own respective licenses.
