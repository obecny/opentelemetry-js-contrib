'use strict';

const { RuntimeMetrics } = require('@opentelemetry/runtime-metrics');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

const exporter = new PrometheusExporter(
  {
    port: 9465,
    startServer: true,
  },
  () => {
    console.log('prometheus scrape endpoint: http://localhost:9465/metrics');
  },
);

const runtimeMetrics = new RuntimeMetrics({
  exporter,
  interval: 2000,
});
runtimeMetrics.start();
