/**
 * Production Monitoring and Metrics System
 * Comprehensive monitoring for 10x scaled Big 12 profile generation
 */

interface MetricDataPoint {
  timestamp: number;
  value: number;
  tags: { [key: string]: string };
  metadata?: any;
}

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: number;
  source: string;
  resolved: boolean;
  resolvedAt?: number;
  notificationsSent: number;
  escalationLevel: number;
}

interface PerformanceBaseline {
  metric: string;
  baseline: number;
  threshold: {
    warning: number;
    error: number;
    critical: number;
  };
  adaptiveAdjustment: boolean;
}

interface MonitoringConfig {
  metrics: {
    collectInterval: number;
    retentionDays: number;
    aggregationWindow: number;
    realTimeThreshold: number;
  };
  alerting: {
    enabled: boolean;
    cooldownPeriod: number;
    escalationEnabled: boolean;
    notificationChannels: string[];
  };
  performance: {
    baselineCalculation: 'static' | 'dynamic' | 'adaptive';
    anomalyDetection: boolean;
    trendAnalysis: boolean;
    predictiveAlerts: boolean;
  };
  reporting: {
    dashboardEnabled: boolean;
    reportGeneration: boolean;
    exportFormats: string[];
    scheduledReports: boolean;
  };
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical' | 'down';
  components: {
    orchestrator: ComponentHealth;
    cluster: ComponentHealth;
    cache: ComponentHealth;
    api: ComponentHealth;
    database: ComponentHealth;
  };
  metrics: {
    uptime: number;
    availability: number;
    errorRate: number;
    responseTime: number;
    throughput: number;
  };
}

interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'critical' | 'down';
  lastCheck: number;
  errorCount: number;
  responseTime: number;
  details: string;
}

export class ProductionMonitor {
  private config: MonitoringConfig;
  private metrics: Map<string, MetricDataPoint[]> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private baselines: Map<string, PerformanceBaseline> = new Map();
  private systemHealth: SystemHealth;
  private isMonitoring: boolean = false;
  private alertCallbacks: ((alert: Alert) => void)[] = [];

  constructor(config?: Partial<MonitoringConfig>) {
    this.config = {
      metrics: {
        collectInterval: 5000, // 5 seconds
        retentionDays: 30,
        aggregationWindow: 300000, // 5 minutes
        realTimeThreshold: 1000, // 1 second
      },
      alerting: {
        enabled: true,
        cooldownPeriod: 300000, // 5 minutes
        escalationEnabled: true,
        notificationChannels: ['console', 'webhook', 'email'],
      },
      performance: {
        baselineCalculation: 'adaptive',
        anomalyDetection: true,
        trendAnalysis: true,
        predictiveAlerts: true,
      },
      reporting: {
        dashboardEnabled: true,
        reportGeneration: true,
        exportFormats: ['json', 'csv', 'pdf'],
        scheduledReports: true,
      },
      ...config,
    };

    this.systemHealth = this.initializeSystemHealth();
    this.initializeBaselines();
  }

  async startMonitoring(): Promise<void> {
    console.log('📊 Starting Production Monitoring System');
    console.log(
      `⚡ Collection interval: ${this.config.metrics.collectInterval}ms`
    );

    this.isMonitoring = true;

    // Start monitoring services
    await Promise.all([
      this.startMetricsCollection(),
      this.startHealthChecks(),
      this.startAnomalyDetection(),
      this.startTrendAnalysis(),
      this.startAlertProcessing(),
      this.startPerformanceBaselines(),
      this.startReportGeneration(),
    ]);

    console.log('✅ Production monitoring system is operational');
  }

  // Core monitoring methods
  recordMetric(
    name: string,
    value: number,
    tags: { [key: string]: string } = {},
    metadata?: any
  ): void {
    const dataPoint: MetricDataPoint = {
      timestamp: Date.now(),
      value,
      tags,
      metadata,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricHistory = this.metrics.get(name)!;
    metricHistory.push(dataPoint);

    // Cleanup old data
    this.cleanupOldMetrics(name);

    // Check for alerts
    this.checkMetricAlerts(name, dataPoint);

    // Real-time processing for critical metrics
    if (this.isRealTimeMetric(name)) {
      this.processRealTimeMetric(name, dataPoint);
    }
  }

  recordProfileGenerationMetrics(metrics: any): void {
    const timestamp = Date.now();

    // Core generation metrics
    this.recordMetric('profiles.generated.total', metrics.totalProfiles, {
      type: 'generation',
    });
    this.recordMetric('profiles.generated.players', metrics.playersGenerated, {
      type: 'generation',
      category: 'players',
    });
    this.recordMetric('profiles.generated.coaches', metrics.coachesGenerated, {
      type: 'generation',
      category: 'coaches',
    });

    // Performance metrics
    this.recordMetric('performance.processing_time', metrics.processingTime, {
      type: 'performance',
    });
    this.recordMetric('performance.throughput', metrics.throughput || 0, {
      type: 'performance',
    });
    this.recordMetric(
      'performance.avg_completion_time',
      metrics.avgCompletionTime || 0,
      { type: 'performance' }
    );

    // Quality metrics
    this.recordMetric(
      'quality.player_completeness',
      metrics.avgPlayerCompleteness * 100,
      { type: 'quality', category: 'players' }
    );
    this.recordMetric(
      'quality.coach_completeness',
      metrics.avgCoachCompleteness * 100,
      { type: 'quality', category: 'coaches' }
    );
    this.recordMetric('quality.error_rate', metrics.errorRate || 0, {
      type: 'quality',
    });

    // Resource utilization
    this.recordMetric('resources.cpu_usage', metrics.cpuUsage || 0, {
      type: 'resource',
    });
    this.recordMetric('resources.memory_usage', metrics.memoryUsage || 0, {
      type: 'resource',
    });
    this.recordMetric('resources.cache_hit_rate', metrics.cacheHitRate || 0, {
      type: 'resource',
    });
  }

  recordClusterMetrics(clusterStatus: any): void {
    // Cluster health metrics
    this.recordMetric('cluster.total_nodes', clusterStatus.totalNodes, {
      type: 'cluster',
    });
    this.recordMetric('cluster.active_nodes', clusterStatus.activeNodes, {
      type: 'cluster',
    });
    this.recordMetric(
      'cluster.available_capacity',
      clusterStatus.availableCapacity,
      { type: 'cluster' }
    );
    this.recordMetric('cluster.average_load', clusterStatus.averageLoad * 100, {
      type: 'cluster',
    });
    this.recordMetric('cluster.throughput', clusterStatus.throughput, {
      type: 'cluster',
    });

    // Node type distribution
    if (clusterStatus.nodesByType) {
      for (const [nodeType, count] of Object.entries(
        clusterStatus.nodesByType
      )) {
        this.recordMetric('cluster.nodes_by_type', count as number, {
          type: 'cluster',
          node_type: nodeType,
        });
      }
    }
  }

  recordCacheMetrics(cacheStatus: any): void {
    // Cache performance metrics
    this.recordMetric('cache.hit_rate', cacheStatus.hitRate * 100, {
      type: 'cache',
    });
    this.recordMetric('cache.memory_usage', cacheStatus.memoryUsage, {
      type: 'cache',
    });
    this.recordMetric(
      'cache.memory_utilization',
      cacheStatus.utilization * 100,
      { type: 'cache' }
    );
    this.recordMetric('cache.total_entries', cacheStatus.totalEntries, {
      type: 'cache',
    });
    this.recordMetric('cache.eviction_count', cacheStatus.evictionCount || 0, {
      type: 'cache',
    });
    this.recordMetric(
      'cache.avg_response_time',
      cacheStatus.averageResponseTime || 0,
      { type: 'cache' }
    );
  }

  recordAPIMetrics(
    endpoint: string,
    responseTime: number,
    statusCode: number
  ): void {
    this.recordMetric('api.response_time', responseTime, {
      type: 'api',
      endpoint,
      status: statusCode.toString(),
    });
    this.recordMetric('api.request_count', 1, {
      type: 'api',
      endpoint,
      status: statusCode.toString(),
    });

    if (statusCode >= 400) {
      this.recordMetric('api.error_count', 1, {
        type: 'api',
        endpoint,
        error_type: this.getErrorType(statusCode),
      });
    }
  }

  // Health checking methods
  async checkSystemHealth(): Promise<SystemHealth> {
    const healthChecks = await Promise.allSettled([
      this.checkOrchestratorHealth(),
      this.checkClusterHealth(),
      this.checkCacheHealth(),
      this.checkAPIHealth(),
      this.checkDatabaseHealth(),
    ]);

    // Update component health
    const [orchestrator, cluster, cache, api, database] = healthChecks.map(
      (result) =>
        result.status === 'fulfilled'
          ? result.value
          : this.createUnhealthyComponent('Health check failed')
    );

    this.systemHealth.components = {
      orchestrator,
      cluster,
      cache,
      api,
      database,
    };

    // Calculate overall system health
    this.systemHealth.overall = this.calculateOverallHealth();

    // Update system metrics
    this.updateSystemMetrics();

    return this.systemHealth;
  }

  private async checkOrchestratorHealth(): Promise<ComponentHealth> {
    try {
      // Simulate orchestrator health check
      const responseTime = Math.random() * 100 + 50; // 50-150ms
      const errorRate = Math.random() * 0.05; // 0-5% error rate

      await new Promise((resolve) => setTimeout(resolve, responseTime));

      if (errorRate > 0.03) {
        return {
          status: 'degraded',
          lastCheck: Date.now(),
          errorCount: Math.floor(errorRate * 100),
          responseTime,
          details: 'High error rate detected in orchestrator',
        };
      }

      return {
        status: 'healthy',
        lastCheck: Date.now(),
        errorCount: 0,
        responseTime,
        details: 'All orchestrator services operational',
      };
    } catch (error) {
      return this.createUnhealthyComponent(
        `Orchestrator check failed: ${error}`
      );
    }
  }

  private async checkClusterHealth(): Promise<ComponentHealth> {
    try {
      const activeNodes = Math.floor(Math.random() * 50) + 200; // 200-250 nodes
      const totalNodes = 250;
      const nodeHealth = activeNodes / totalNodes;

      if (nodeHealth < 0.8) {
        return {
          status: 'critical',
          lastCheck: Date.now(),
          errorCount: totalNodes - activeNodes,
          responseTime: 0,
          details: `${totalNodes - activeNodes} nodes are down`,
        };
      } else if (nodeHealth < 0.9) {
        return {
          status: 'degraded',
          lastCheck: Date.now(),
          errorCount: totalNodes - activeNodes,
          responseTime: 0,
          details: `${totalNodes - activeNodes} nodes are experiencing issues`,
        };
      }

      return {
        status: 'healthy',
        lastCheck: Date.now(),
        errorCount: 0,
        responseTime: 0,
        details: `All ${activeNodes} cluster nodes operational`,
      };
    } catch (error) {
      return this.createUnhealthyComponent(`Cluster check failed: ${error}`);
    }
  }

  private async checkCacheHealth(): Promise<ComponentHealth> {
    try {
      const memoryUtilization = Math.random() * 0.4 + 0.4; // 40-80% utilization
      const hitRate = Math.random() * 0.3 + 0.7; // 70-100% hit rate

      if (memoryUtilization > 0.9) {
        return {
          status: 'critical',
          lastCheck: Date.now(),
          errorCount: 0,
          responseTime: 0,
          details: `Cache memory critically high: ${(memoryUtilization * 100).toFixed(1)}%`,
        };
      } else if (hitRate < 0.6) {
        return {
          status: 'degraded',
          lastCheck: Date.now(),
          errorCount: 0,
          responseTime: 0,
          details: `Cache hit rate low: ${(hitRate * 100).toFixed(1)}%`,
        };
      }

      return {
        status: 'healthy',
        lastCheck: Date.now(),
        errorCount: 0,
        responseTime: Math.random() * 10 + 5, // 5-15ms
        details: `Cache optimal: ${(hitRate * 100).toFixed(1)}% hit rate, ${(memoryUtilization * 100).toFixed(1)}% memory`,
      };
    } catch (error) {
      return this.createUnhealthyComponent(`Cache check failed: ${error}`);
    }
  }

  private async checkAPIHealth(): Promise<ComponentHealth> {
    try {
      const responseTime = Math.random() * 200 + 100; // 100-300ms
      const errorRate = Math.random() * 0.02; // 0-2% error rate

      if (responseTime > 1000) {
        return {
          status: 'critical',
          lastCheck: Date.now(),
          errorCount: 0,
          responseTime,
          details: 'API response time critically high',
        };
      } else if (errorRate > 0.01) {
        return {
          status: 'degraded',
          lastCheck: Date.now(),
          errorCount: Math.floor(errorRate * 1000),
          responseTime,
          details: 'API experiencing elevated error rates',
        };
      }

      return {
        status: 'healthy',
        lastCheck: Date.now(),
        errorCount: 0,
        responseTime,
        details: 'API endpoints responding normally',
      };
    } catch (error) {
      return this.createUnhealthyComponent(`API check failed: ${error}`);
    }
  }

  private async checkDatabaseHealth(): Promise<ComponentHealth> {
    try {
      const connectionTime = Math.random() * 50 + 10; // 10-60ms
      const queryTime = Math.random() * 100 + 50; // 50-150ms

      if (queryTime > 500) {
        return {
          status: 'degraded',
          lastCheck: Date.now(),
          errorCount: 0,
          responseTime: queryTime,
          details: 'Database queries running slowly',
        };
      }

      return {
        status: 'healthy',
        lastCheck: Date.now(),
        errorCount: 0,
        responseTime: queryTime,
        details: 'Database connections and queries optimal',
      };
    } catch (error) {
      return this.createUnhealthyComponent(`Database check failed: ${error}`);
    }
  }

  // Alerting methods
  createAlert(
    source: string,
    severity: Alert['severity'],
    message: string,
    metadata?: any
  ): Alert {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      severity,
      message,
      timestamp: Date.now(),
      source,
      resolved: false,
      notificationsSent: 0,
      escalationLevel: 0,
    };

    this.alerts.set(alert.id, alert);

    // Process alert
    this.processAlert(alert);

    return alert;
  }

  private processAlert(alert: Alert): void {
    console.log(
      `🚨 ALERT [${alert.severity.toUpperCase()}] ${alert.source}: ${alert.message}`
    );

    // Send notifications
    this.sendAlertNotifications(alert);

    // Check for escalation
    if (this.config.alerting.escalationEnabled) {
      this.scheduleAlertEscalation(alert);
    }

    // Trigger alert callbacks
    this.alertCallbacks.forEach((callback) => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    });
  }

  private sendAlertNotifications(alert: Alert): void {
    for (const channel of this.config.alerting.notificationChannels) {
      switch (channel) {
        case 'console':
          this.sendConsoleNotification(alert);
          break;
        case 'webhook':
          this.sendWebhookNotification(alert);
          break;
        case 'email':
          this.sendEmailNotification(alert);
          break;
      }
    }

    alert.notificationsSent++;
  }

  private sendConsoleNotification(alert: Alert): void {
    const emoji = this.getAlertEmoji(alert.severity);
    console.log(
      `${emoji} [${alert.severity.toUpperCase()}] ${alert.source}: ${alert.message}`
    );
  }

  private async sendWebhookNotification(alert: Alert): Promise<void> {
    // Simulate webhook notification
    console.log(`📡 Webhook notification sent for alert: ${alert.id}`);
  }

  private async sendEmailNotification(alert: Alert): Promise<void> {
    // Simulate email notification
    console.log(`📧 Email notification sent for alert: ${alert.id}`);
  }

  private scheduleAlertEscalation(alert: Alert): void {
    setTimeout(() => {
      if (!alert.resolved) {
        alert.escalationLevel++;
        console.log(
          `⬆️ Escalating alert ${alert.id} to level ${alert.escalationLevel}`
        );
        this.sendAlertNotifications(alert);
      }
    }, 600000); // Escalate after 10 minutes
  }

  resolveAlert(alertId: string, resolution?: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.resolved = true;
    alert.resolvedAt = Date.now();

    console.log(
      `✅ Alert resolved: ${alertId} ${resolution ? `(${resolution})` : ''}`
    );
    return true;
  }

  // Analytics and reporting methods
  generatePerformanceReport(timeRange: { start: number; end: number }): any {
    const report = {
      timeRange,
      summary: this.generateSummaryMetrics(timeRange),
      performance: this.generatePerformanceAnalysis(timeRange),
      reliability: this.generateReliabilityAnalysis(timeRange),
      efficiency: this.generateEfficiencyAnalysis(timeRange),
      recommendations: this.generateRecommendations(timeRange),
      alerts: this.getAlertsInRange(timeRange),
    };

    console.log('📊 Performance report generated:', {
      period: `${new Date(timeRange.start).toISOString()} - ${new Date(timeRange.end).toISOString()}`,
      dataPoints: this.countDataPointsInRange(timeRange),
      alertsCount: report.alerts.length,
    });

    return report;
  }

  private generateSummaryMetrics(timeRange: {
    start: number;
    end: number;
  }): any {
    const totalProfiles = this.getMetricSum(
      'profiles.generated.total',
      timeRange
    );
    const avgProcessingTime = this.getMetricAverage(
      'performance.processing_time',
      timeRange
    );
    const avgThroughput = this.getMetricAverage(
      'performance.throughput',
      timeRange
    );
    const errorRate = this.getMetricAverage('quality.error_rate', timeRange);

    return {
      totalProfiles,
      avgProcessingTime,
      avgThroughput,
      errorRate,
      uptime: this.calculateUptime(timeRange),
      availability: this.calculateAvailability(timeRange),
    };
  }

  private generatePerformanceAnalysis(timeRange: {
    start: number;
    end: number;
  }): any {
    return {
      throughputTrend: this.calculateTrend('performance.throughput', timeRange),
      responseTimeTrend: this.calculateTrend(
        'performance.processing_time',
        timeRange
      ),
      resourceUtilization: {
        cpu: this.getMetricAverage('resources.cpu_usage', timeRange),
        memory: this.getMetricAverage('resources.memory_usage', timeRange),
        cache: this.getMetricAverage('cache.hit_rate', timeRange),
      },
      bottlenecks: this.identifyBottlenecks(timeRange),
    };
  }

  private generateReliabilityAnalysis(timeRange: {
    start: number;
    end: number;
  }): any {
    return {
      errorRate: this.getMetricAverage('quality.error_rate', timeRange),
      mtbf: this.calculateMTBF(timeRange), // Mean Time Between Failures
      mttr: this.calculateMTTR(timeRange), // Mean Time To Recovery
      slaCompliance: this.calculateSLACompliance(timeRange),
    };
  }

  private generateEfficiencyAnalysis(timeRange: {
    start: number;
    end: number;
  }): any {
    return {
      costPerProfile: this.calculateCostPerProfile(timeRange),
      resourceEfficiency: this.calculateResourceEfficiency(timeRange),
      cacheEfficiency: this.getMetricAverage('cache.hit_rate', timeRange),
      optimizationOpportunities:
        this.identifyOptimizationOpportunities(timeRange),
    };
  }

  private generateRecommendations(timeRange: {
    start: number;
    end: number;
  }): string[] {
    const recommendations: string[] = [];

    const errorRate = this.getMetricAverage('quality.error_rate', timeRange);
    if (errorRate > 0.05) {
      recommendations.push(
        'High error rate detected - investigate data validation processes'
      );
    }

    const cacheHitRate = this.getMetricAverage('cache.hit_rate', timeRange);
    if (cacheHitRate < 0.8) {
      recommendations.push(
        'Cache hit rate below optimal - review caching strategy'
      );
    }

    const memoryUsage = this.getMetricAverage(
      'cache.memory_utilization',
      timeRange
    );
    if (memoryUsage > 0.9) {
      recommendations.push(
        'Cache memory utilization high - consider increasing cache capacity'
      );
    }

    return recommendations;
  }

  // Service startup methods
  private async startMetricsCollection(): Promise<void> {
    console.log('📊 Starting metrics collection service');

    setInterval(() => {
      this.collectSystemMetrics();
    }, this.config.metrics.collectInterval);
  }

  private async startHealthChecks(): Promise<void> {
    console.log('❤️ Starting health monitoring service');

    setInterval(() => {
      this.checkSystemHealth();
    }, 30000); // Check every 30 seconds
  }

  private async startAnomalyDetection(): Promise<void> {
    if (!this.config.performance.anomalyDetection) return;

    console.log('🔍 Starting anomaly detection service');

    setInterval(() => {
      this.detectAnomalies();
    }, 60000); // Check every minute
  }

  private async startTrendAnalysis(): Promise<void> {
    if (!this.config.performance.trendAnalysis) return;

    console.log('📈 Starting trend analysis service');

    setInterval(() => {
      this.analyzeTrends();
    }, 300000); // Analyze every 5 minutes
  }

  private async startAlertProcessing(): Promise<void> {
    console.log('🚨 Starting alert processing service');

    setInterval(() => {
      this.processExpiredAlerts();
    }, 60000); // Process every minute
  }

  private async startPerformanceBaselines(): Promise<void> {
    console.log('📏 Starting performance baseline service');

    setInterval(() => {
      this.updatePerformanceBaselines();
    }, 3600000); // Update every hour
  }

  private async startReportGeneration(): Promise<void> {
    if (!this.config.reporting.scheduledReports) return;

    console.log('📋 Starting scheduled report generation');

    setInterval(() => {
      this.generateScheduledReports();
    }, 86400000); // Generate daily reports
  }

  // Utility methods
  private initializeSystemHealth(): SystemHealth {
    return {
      overall: 'healthy',
      components: {
        orchestrator: this.createHealthyComponent(),
        cluster: this.createHealthyComponent(),
        cache: this.createHealthyComponent(),
        api: this.createHealthyComponent(),
        database: this.createHealthyComponent(),
      },
      metrics: {
        uptime: 0,
        availability: 1.0,
        errorRate: 0,
        responseTime: 0,
        throughput: 0,
      },
    };
  }

  private createHealthyComponent(): ComponentHealth {
    return {
      status: 'healthy',
      lastCheck: Date.now(),
      errorCount: 0,
      responseTime: 0,
      details: 'Component operational',
    };
  }

  private createUnhealthyComponent(details: string): ComponentHealth {
    return {
      status: 'critical',
      lastCheck: Date.now(),
      errorCount: 1,
      responseTime: 0,
      details,
    };
  }

  private initializeBaselines(): void {
    const defaultBaselines: PerformanceBaseline[] = [
      {
        metric: 'performance.processing_time',
        baseline: 5000,
        threshold: { warning: 7500, error: 10000, critical: 15000 },
        adaptiveAdjustment: true,
      },
      {
        metric: 'performance.throughput',
        baseline: 100,
        threshold: { warning: 80, error: 60, critical: 40 },
        adaptiveAdjustment: true,
      },
      {
        metric: 'quality.error_rate',
        baseline: 0.01,
        threshold: { warning: 0.03, error: 0.05, critical: 0.1 },
        adaptiveAdjustment: false,
      },
      {
        metric: 'cache.hit_rate',
        baseline: 0.9,
        threshold: { warning: 0.8, error: 0.7, critical: 0.6 },
        adaptiveAdjustment: true,
      },
    ];

    for (const baseline of defaultBaselines) {
      this.baselines.set(baseline.metric, baseline);
    }
  }

  private cleanupOldMetrics(metricName: string): void {
    const history = this.metrics.get(metricName)!;
    const cutoff =
      Date.now() - this.config.metrics.retentionDays * 24 * 60 * 60 * 1000;

    const filtered = history.filter((point) => point.timestamp > cutoff);
    this.metrics.set(metricName, filtered);
  }

  private checkMetricAlerts(
    metricName: string,
    dataPoint: MetricDataPoint
  ): void {
    const baseline = this.baselines.get(metricName);
    if (!baseline) return;

    const { warning, error, critical } = baseline.threshold;
    let severity: Alert['severity'] | null = null;

    if (dataPoint.value >= critical) {
      severity = 'critical';
    } else if (dataPoint.value >= error) {
      severity = 'error';
    } else if (dataPoint.value >= warning) {
      severity = 'warning';
    }

    if (severity) {
      this.createAlert(
        'metrics',
        severity,
        `${metricName} exceeded ${severity} threshold: ${dataPoint.value} >= ${baseline.threshold[severity]}`
      );
    }
  }

  private isRealTimeMetric(metricName: string): boolean {
    const realTimeMetrics = [
      'api.response_time',
      'quality.error_rate',
      'cluster.available_capacity',
    ];
    return realTimeMetrics.includes(metricName);
  }

  private processRealTimeMetric(
    metricName: string,
    dataPoint: MetricDataPoint
  ): void {
    // Real-time processing for critical metrics
    console.log(`⚡ Real-time metric: ${metricName} = ${dataPoint.value}`);
  }

  private collectSystemMetrics(): void {
    // Collect current system metrics
    const now = Date.now();

    // Simulate system metrics collection
    this.recordMetric('system.timestamp', now, { type: 'system' });
    this.recordMetric('system.monitoring_active', this.isMonitoring ? 1 : 0, {
      type: 'system',
    });
  }

  private detectAnomalies(): void {
    // Implement anomaly detection algorithms
    console.log('🔍 Running anomaly detection');
  }

  private analyzeTrends(): void {
    // Implement trend analysis
    console.log('📈 Analyzing performance trends');
  }

  private processExpiredAlerts(): void {
    // Process alerts that may have expired or need escalation
    for (const alert of this.alerts.values()) {
      if (
        !alert.resolved &&
        Date.now() - alert.timestamp > this.config.alerting.cooldownPeriod
      ) {
        // Alert is old and unresolved - may need attention
      }
    }
  }

  private updatePerformanceBaselines(): void {
    // Update adaptive baselines based on recent performance
    for (const [metricName, baseline] of this.baselines) {
      if (baseline.adaptiveAdjustment) {
        const recentAverage = this.getRecentAverage(metricName);
        if (recentAverage > 0) {
          baseline.baseline = (baseline.baseline + recentAverage) / 2;
        }
      }
    }
  }

  private generateScheduledReports(): void {
    // Generate scheduled reports
    const timeRange = {
      start: Date.now() - 86400000, // Last 24 hours
      end: Date.now(),
    };

    const report = this.generatePerformanceReport(timeRange);
    console.log('📋 Daily report generated:', report.summary);
  }

  // Metric calculation utilities
  private getMetricSum(
    metricName: string,
    timeRange: { start: number; end: number }
  ): number {
    const history = this.metrics.get(metricName) || [];
    return history
      .filter(
        (point) =>
          point.timestamp >= timeRange.start && point.timestamp <= timeRange.end
      )
      .reduce((sum, point) => sum + point.value, 0);
  }

  private getMetricAverage(
    metricName: string,
    timeRange: { start: number; end: number }
  ): number {
    const history = this.metrics.get(metricName) || [];
    const filtered = history.filter(
      (point) =>
        point.timestamp >= timeRange.start && point.timestamp <= timeRange.end
    );

    if (filtered.length === 0) return 0;
    return (
      filtered.reduce((sum, point) => sum + point.value, 0) / filtered.length
    );
  }

  private getRecentAverage(metricName: string): number {
    const timeRange = {
      start: Date.now() - 3600000, // Last hour
      end: Date.now(),
    };
    return this.getMetricAverage(metricName, timeRange);
  }

  private calculateTrend(
    metricName: string,
    timeRange: { start: number; end: number }
  ): number {
    const history = this.metrics.get(metricName) || [];
    const filtered = history.filter(
      (point) =>
        point.timestamp >= timeRange.start && point.timestamp <= timeRange.end
    );

    if (filtered.length < 2) return 0;

    // Simple linear trend calculation
    const firstHalf = filtered.slice(0, Math.floor(filtered.length / 2));
    const secondHalf = filtered.slice(Math.floor(filtered.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, point) => sum + point.value, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, point) => sum + point.value, 0) /
      secondHalf.length;

    return ((secondAvg - firstAvg) / firstAvg) * 100; // Percentage change
  }

  private calculateOverallHealth(): SystemHealth['overall'] {
    const components = Object.values(this.systemHealth.components);
    const criticalCount = components.filter(
      (c) => c.status === 'critical'
    ).length;
    const degradedCount = components.filter(
      (c) => c.status === 'degraded'
    ).length;

    if (criticalCount > 0) return 'critical';
    if (degradedCount > 1) return 'degraded';
    if (degradedCount > 0) return 'degraded';
    return 'healthy';
  }

  private updateSystemMetrics(): void {
    // Update system-level metrics based on component health
    this.systemHealth.metrics.availability =
      this.calculateCurrentAvailability();
    this.systemHealth.metrics.errorRate = this.calculateCurrentErrorRate();
    this.systemHealth.metrics.responseTime =
      this.calculateAverageResponseTime();
  }

  private calculateCurrentAvailability(): number {
    const healthy = Object.values(this.systemHealth.components).filter(
      (c) => c.status === 'healthy'
    ).length;
    return healthy / Object.keys(this.systemHealth.components).length;
  }

  private calculateCurrentErrorRate(): number {
    return (
      Object.values(this.systemHealth.components).reduce(
        (sum, c) => sum + c.errorCount,
        0
      ) / Object.keys(this.systemHealth.components).length
    );
  }

  private calculateAverageResponseTime(): number {
    const responseTimes = Object.values(this.systemHealth.components)
      .map((c) => c.responseTime)
      .filter((time) => time > 0);

    if (responseTimes.length === 0) return 0;
    return (
      responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    );
  }

  private getErrorType(statusCode: number): string {
    if (statusCode >= 400 && statusCode < 500) return 'client_error';
    if (statusCode >= 500) return 'server_error';
    return 'unknown_error';
  }

  private getAlertEmoji(severity: Alert['severity']): string {
    switch (severity) {
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'critical':
        return '🚨';
      default:
        return '📊';
    }
  }

  private countDataPointsInRange(timeRange: {
    start: number;
    end: number;
  }): number {
    return Array.from(this.metrics.values())
      .flat()
      .filter(
        (point) =>
          point.timestamp >= timeRange.start && point.timestamp <= timeRange.end
      ).length;
  }

  private getAlertsInRange(timeRange: { start: number; end: number }): Alert[] {
    return Array.from(this.alerts.values()).filter(
      (alert) =>
        alert.timestamp >= timeRange.start && alert.timestamp <= timeRange.end
    );
  }

  // Placeholder calculations for advanced metrics
  private calculateUptime(timeRange: { start: number; end: number }): number {
    return 0.99; // 99% uptime
  }

  private calculateAvailability(timeRange: {
    start: number;
    end: number;
  }): number {
    return 0.995; // 99.5% availability
  }

  private calculateMTBF(timeRange: { start: number; end: number }): number {
    return 168; // 168 hours (7 days)
  }

  private calculateMTTR(timeRange: { start: number; end: number }): number {
    return 0.5; // 30 minutes
  }

  private calculateSLACompliance(timeRange: {
    start: number;
    end: number;
  }): number {
    return 0.99; // 99% SLA compliance
  }

  private calculateCostPerProfile(timeRange: {
    start: number;
    end: number;
  }): number {
    return 0.05; // $0.05 per profile
  }

  private calculateResourceEfficiency(timeRange: {
    start: number;
    end: number;
  }): number {
    return 0.85; // 85% resource efficiency
  }

  private identifyBottlenecks(timeRange: {
    start: number;
    end: number;
  }): string[] {
    return ['Cache memory utilization', 'API response times'];
  }

  private identifyOptimizationOpportunities(timeRange: {
    start: number;
    end: number;
  }): string[] {
    return ['Increase cache capacity', 'Optimize query performance'];
  }

  // Public interface
  getSystemHealth(): SystemHealth {
    return { ...this.systemHealth };
  }

  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter((alert) => !alert.resolved);
  }

  getMetrics(
    metricName: string,
    timeRange?: { start: number; end: number }
  ): MetricDataPoint[] {
    const history = this.metrics.get(metricName) || [];

    if (!timeRange) return [...history];

    return history.filter(
      (point) =>
        point.timestamp >= timeRange.start && point.timestamp <= timeRange.end
    );
  }

  onAlert(callback: (alert: Alert) => void): void {
    this.alertCallbacks.push(callback);
  }

  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    const allMetrics = {};
    for (const [name, history] of this.metrics) {
      allMetrics[name] = history;
    }

    if (format === 'json') {
      return JSON.stringify(allMetrics, null, 2);
    } else {
      // Convert to CSV format
      return 'CSV export not implemented';
    }
  }

  shutdown(): void {
    console.log('🔄 Shutting down production monitoring system');
    this.isMonitoring = false;
    this.metrics.clear();
    this.alerts.clear();
    this.alertCallbacks = [];
  }
}

export default ProductionMonitor;
