/**
 * Auto-Scaling and Load Balancing System
 * Intelligent scaling for 10x production capacity management
 */

interface ScalingMetrics {
  cpuUtilization: number;
  memoryUtilization: number;
  activeConnections: number;
  queueDepth: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  requestsPerSecond: number;
}

interface ScalingPolicy {
  name: string;
  enabled: boolean;
  scaleUpThreshold: number;
  scaleDownThreshold: number;
  cooldownPeriod: number;
  minInstances: number;
  maxInstances: number;
  stepSize: number;
  metricType: keyof ScalingMetrics;
  evaluationPeriods: number;
  predictiveScaling: boolean;
}

interface LoadBalancerConfig {
  algorithm:
    | 'round-robin'
    | 'weighted'
    | 'least-connections'
    | 'ip-hash'
    | 'intelligent';
  healthCheckInterval: number;
  healthCheckTimeout: number;
  healthCheckPath: string;
  stickySession: boolean;
  connectionDraining: boolean;
  drainingTimeout: number;
}

interface ScalingEvent {
  id: string;
  timestamp: number;
  type: 'scale-up' | 'scale-down';
  trigger: string;
  previousInstances: number;
  newInstances: number;
  reason: string;
  duration: number;
  success: boolean;
}

interface Instance {
  id: string;
  type: 'orchestrator' | 'worker' | 'cache' | 'api';
  status: 'starting' | 'healthy' | 'unhealthy' | 'draining' | 'terminated';
  createdAt: number;
  lastHealthCheck: number;
  metrics: ScalingMetrics;
  connections: number;
  weight: number;
  zone: string;
  version: string;
}

export class AutoScaler {
  private scalingPolicies: Map<string, ScalingPolicy> = new Map();
  private instances: Map<string, Instance> = new Map();
  private scalingEvents: ScalingEvent[] = [];
  private loadBalancerConfig: LoadBalancerConfig;
  private isRunning: boolean = false;
  private lastScalingAction: number = 0;
  private predictionModel: Map<string, number[]> = new Map();

  constructor(config?: {
    loadBalancer?: Partial<LoadBalancerConfig>;
    defaultPolicies?: boolean;
  }) {
    this.loadBalancerConfig = {
      algorithm: 'intelligent',
      healthCheckInterval: 30000, // 30 seconds
      healthCheckTimeout: 5000, // 5 seconds
      healthCheckPath: '/health',
      stickySession: false,
      connectionDraining: true,
      drainingTimeout: 300000, // 5 minutes
      ...config?.loadBalancer,
    };

    if (config?.defaultPolicies !== false) {
      this.initializeDefaultPolicies();
    }

    this.initializeBaseInstances();
  }

  async startAutoScaling(): Promise<void> {
    console.log('⚖️ Starting Auto-Scaling and Load Balancing System');
    console.log(
      `📊 Load balancer algorithm: ${this.loadBalancerConfig.algorithm}`
    );
    console.log(`📈 Active scaling policies: ${this.scalingPolicies.size}`);

    this.isRunning = true;

    // Start auto-scaling services
    await Promise.all([
      this.startMetricsCollection(),
      this.startScalingEngine(),
      this.startLoadBalancer(),
      this.startHealthChecks(),
      this.startPredictiveScaling(),
      this.startConnectionDraining(),
      this.startScalingEventLogger(),
    ]);

    console.log('✅ Auto-scaling system is operational');
  }

  // Scaling policy management
  addScalingPolicy(policy: ScalingPolicy): void {
    this.scalingPolicies.set(policy.name, policy);
    console.log(`📋 Added scaling policy: ${policy.name}`);
  }

  removeScalingPolicy(policyName: string): boolean {
    const removed = this.scalingPolicies.delete(policyName);
    if (removed) {
      console.log(`🗑️ Removed scaling policy: ${policyName}`);
    }
    return removed;
  }

  updateScalingPolicy(
    policyName: string,
    updates: Partial<ScalingPolicy>
  ): boolean {
    const policy = this.scalingPolicies.get(policyName);
    if (!policy) return false;

    Object.assign(policy, updates);
    console.log(`🔄 Updated scaling policy: ${policyName}`);
    return true;
  }

  // Load balancing methods
  selectInstance(instanceType: string, requestData?: any): Instance | null {
    const availableInstances = this.getHealthyInstances(instanceType);
    if (availableInstances.length === 0) return null;

    switch (this.loadBalancerConfig.algorithm) {
      case 'round-robin':
        return this.selectRoundRobin(availableInstances);

      case 'weighted':
        return this.selectWeighted(availableInstances);

      case 'least-connections':
        return this.selectLeastConnections(availableInstances);

      case 'ip-hash':
        return this.selectIPHash(availableInstances, requestData?.clientIP);

      case 'intelligent':
      default:
        return this.selectIntelligent(availableInstances, requestData);
    }
  }

  private selectRoundRobin(instances: Instance[]): Instance {
    // Simple round-robin selection
    const index = Math.floor(Date.now() / 1000) % instances.length;
    return instances[index];
  }

  private selectWeighted(instances: Instance[]): Instance {
    const totalWeight = instances.reduce(
      (sum, instance) => sum + instance.weight,
      0
    );
    const random = Math.random() * totalWeight;

    let currentWeight = 0;
    for (const instance of instances) {
      currentWeight += instance.weight;
      if (random <= currentWeight) return instance;
    }

    return instances[0];
  }

  private selectLeastConnections(instances: Instance[]): Instance {
    return instances.reduce((least, current) =>
      current.connections < least.connections ? current : least
    );
  }

  private selectIPHash(instances: Instance[], clientIP?: string): Instance {
    if (!clientIP) return this.selectRoundRobin(instances);

    // Hash the client IP to consistently select the same instance
    let hash = 0;
    for (let i = 0; i < clientIP.length; i++) {
      const char = clientIP.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    const index = Math.abs(hash) % instances.length;
    return instances[index];
  }

  private selectIntelligent(
    instances: Instance[],
    requestData?: any
  ): Instance {
    // Advanced selection based on multiple factors
    const scoredInstances = instances.map((instance) => ({
      instance,
      score: this.calculateInstanceScore(instance, requestData),
    }));

    // Sort by score (highest first)
    scoredInstances.sort((a, b) => b.score - a.score);

    return scoredInstances[0].instance;
  }

  private calculateInstanceScore(
    instance: Instance,
    requestData?: any
  ): number {
    let score = 100; // Base score

    // Performance factors
    score -= instance.metrics.cpuUtilization * 0.3;
    score -= instance.metrics.memoryUtilization * 0.2;
    score -= instance.connections * 0.1;
    score -= instance.metrics.responseTime / 100;
    score -= instance.metrics.errorRate * 50;

    // Health bonus
    if (instance.status === 'healthy') score += 10;

    // Zone diversity bonus
    if (
      requestData?.preferredZone &&
      instance.zone === requestData.preferredZone
    ) {
      score += 5;
    }

    // Weight factor
    score *= instance.weight / 100;

    return Math.max(0, score);
  }

  // Scaling decision engine
  private async evaluateScalingPolicies(): Promise<void> {
    for (const [policyName, policy] of this.scalingPolicies) {
      if (!policy.enabled) continue;

      const decision = await this.evaluatePolicy(policy);
      if (decision) {
        await this.executeScalingDecision(decision, policy);
      }
    }
  }

  private async evaluatePolicy(
    policy: ScalingPolicy
  ): Promise<'scale-up' | 'scale-down' | null> {
    // Check cooldown period
    if (Date.now() - this.lastScalingAction < policy.cooldownPeriod) {
      return null;
    }

    const instances = this.getInstancesByType(
      this.getInstanceTypeForPolicy(policy)
    );
    const currentCount = instances.length;

    // Get recent metrics for evaluation
    const recentMetrics = await this.getRecentMetrics(
      policy.metricType,
      policy.evaluationPeriods
    );
    const avgMetric = this.calculateAverageMetric(recentMetrics);

    // Predictive scaling
    if (policy.predictiveScaling) {
      const predictedValue = this.predictMetricValue(policy.metricType);
      if (
        predictedValue > policy.scaleUpThreshold &&
        currentCount < policy.maxInstances
      ) {
        console.log(
          `🔮 Predictive scale-up triggered for ${policy.name}: predicted ${predictedValue}`
        );
        return 'scale-up';
      }
    }

    // Reactive scaling
    if (
      avgMetric > policy.scaleUpThreshold &&
      currentCount < policy.maxInstances
    ) {
      console.log(
        `📈 Scale-up triggered for ${policy.name}: ${avgMetric} > ${policy.scaleUpThreshold}`
      );
      return 'scale-up';
    }

    if (
      avgMetric < policy.scaleDownThreshold &&
      currentCount > policy.minInstances
    ) {
      console.log(
        `📉 Scale-down triggered for ${policy.name}: ${avgMetric} < ${policy.scaleDownThreshold}`
      );
      return 'scale-down';
    }

    return null;
  }

  private async executeScalingDecision(
    decision: 'scale-up' | 'scale-down',
    policy: ScalingPolicy
  ): Promise<void> {
    const instanceType = this.getInstanceTypeForPolicy(policy);
    const instances = this.getInstancesByType(instanceType);
    const previousCount = instances.length;

    let newCount: number;
    let scalingEvent: ScalingEvent;

    if (decision === 'scale-up') {
      newCount = Math.min(previousCount + policy.stepSize, policy.maxInstances);
      scalingEvent = await this.scaleUp(
        instanceType,
        newCount - previousCount,
        policy
      );
    } else {
      newCount = Math.max(previousCount - policy.stepSize, policy.minInstances);
      scalingEvent = await this.scaleDown(
        instanceType,
        previousCount - newCount,
        policy
      );
    }

    this.scalingEvents.push(scalingEvent);
    this.lastScalingAction = Date.now();

    console.log(
      `⚖️ Scaling completed: ${previousCount} -> ${newCount} instances (${instanceType})`
    );
  }

  private async scaleUp(
    instanceType: string,
    count: number,
    policy: ScalingPolicy
  ): Promise<ScalingEvent> {
    const startTime = Date.now();
    const eventId = `scale-up-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      console.log(`📈 Scaling up ${count} ${instanceType} instances`);

      // Create new instances
      const newInstances = await this.createInstances(instanceType, count);

      // Wait for instances to become healthy
      await this.waitForInstancesHealthy(newInstances);

      // Update load balancer
      await this.updateLoadBalancer();

      return {
        id: eventId,
        timestamp: startTime,
        type: 'scale-up',
        trigger: policy.name,
        previousInstances: this.getInstancesByType(instanceType).length - count,
        newInstances: this.getInstancesByType(instanceType).length,
        reason: `${policy.metricType} exceeded threshold`,
        duration: Date.now() - startTime,
        success: true,
      };
    } catch (error) {
      console.error(`❌ Scale-up failed:`, error);

      return {
        id: eventId,
        timestamp: startTime,
        type: 'scale-up',
        trigger: policy.name,
        previousInstances: this.getInstancesByType(instanceType).length,
        newInstances: this.getInstancesByType(instanceType).length,
        reason: `Scale-up failed: ${error}`,
        duration: Date.now() - startTime,
        success: false,
      };
    }
  }

  private async scaleDown(
    instanceType: string,
    count: number,
    policy: ScalingPolicy
  ): Promise<ScalingEvent> {
    const startTime = Date.now();
    const eventId = `scale-down-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      console.log(`📉 Scaling down ${count} ${instanceType} instances`);

      // Select instances to terminate (least utilized first)
      const instancesToTerminate = this.selectInstancesForTermination(
        instanceType,
        count
      );

      // Start connection draining
      if (this.loadBalancerConfig.connectionDraining) {
        await this.drainConnections(instancesToTerminate);
      }

      // Terminate instances
      await this.terminateInstances(instancesToTerminate);

      // Update load balancer
      await this.updateLoadBalancer();

      return {
        id: eventId,
        timestamp: startTime,
        type: 'scale-down',
        trigger: policy.name,
        previousInstances: this.getInstancesByType(instanceType).length + count,
        newInstances: this.getInstancesByType(instanceType).length,
        reason: `${policy.metricType} below threshold`,
        duration: Date.now() - startTime,
        success: true,
      };
    } catch (error) {
      console.error(`❌ Scale-down failed:`, error);

      return {
        id: eventId,
        timestamp: startTime,
        type: 'scale-down',
        trigger: policy.name,
        previousInstances: this.getInstancesByType(instanceType).length,
        newInstances: this.getInstancesByType(instanceType).length,
        reason: `Scale-down failed: ${error}`,
        duration: Date.now() - startTime,
        success: false,
      };
    }
  }

  // Instance management
  private async createInstances(
    instanceType: string,
    count: number
  ): Promise<Instance[]> {
    const newInstances: Instance[] = [];

    for (let i = 0; i < count; i++) {
      const instance = await this.createInstance(instanceType);
      newInstances.push(instance);
      this.instances.set(instance.id, instance);
    }

    console.log(`✅ Created ${count} new ${instanceType} instances`);
    return newInstances;
  }

  private async createInstance(instanceType: string): Promise<Instance> {
    const instanceId = `${instanceType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Simulate instance creation time
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 3000)
    );

    const instance: Instance = {
      id: instanceId,
      type: instanceType as any,
      status: 'starting',
      createdAt: Date.now(),
      lastHealthCheck: Date.now(),
      metrics: this.createInitialMetrics(),
      connections: 0,
      weight: 100,
      zone: this.selectOptimalZone(),
      version: '1.0.0',
    };

    // Simulate startup time
    setTimeout(
      () => {
        instance.status = 'healthy';
        console.log(`🚀 Instance ${instanceId} is now healthy`);
      },
      5000 + Math.random() * 10000
    );

    return instance;
  }

  private async waitForInstancesHealthy(instances: Instance[]): Promise<void> {
    const healthyPromises = instances.map((instance) =>
      this.waitForInstanceHealthy(instance.id)
    );

    await Promise.all(healthyPromises);
  }

  private async waitForInstanceHealthy(instanceId: string): Promise<void> {
    return new Promise((resolve) => {
      const checkHealth = () => {
        const instance = this.instances.get(instanceId);
        if (instance && instance.status === 'healthy') {
          resolve();
        } else {
          setTimeout(checkHealth, 1000);
        }
      };
      checkHealth();
    });
  }

  private selectInstancesForTermination(
    instanceType: string,
    count: number
  ): Instance[] {
    const instances = this.getInstancesByType(instanceType)
      .filter((instance) => instance.status === 'healthy')
      .sort((a, b) => {
        // Sort by utilization (least utilized first)
        const aUtil = a.metrics.cpuUtilization + a.metrics.memoryUtilization;
        const bUtil = b.metrics.cpuUtilization + b.metrics.memoryUtilization;
        return aUtil - bUtil;
      });

    return instances.slice(0, count);
  }

  private async drainConnections(instances: Instance[]): Promise<void> {
    console.log(`🚰 Draining connections from ${instances.length} instances`);

    // Mark instances as draining
    for (const instance of instances) {
      instance.status = 'draining';
    }

    // Wait for connections to drain or timeout
    const drainPromises = instances.map((instance) =>
      this.waitForConnectionDrain(instance)
    );
    await Promise.race([
      Promise.all(drainPromises),
      new Promise((resolve) =>
        setTimeout(resolve, this.loadBalancerConfig.drainingTimeout)
      ),
    ]);

    console.log(`✅ Connection draining completed`);
  }

  private async waitForConnectionDrain(instance: Instance): Promise<void> {
    return new Promise((resolve) => {
      const checkConnections = () => {
        if (instance.connections <= 0) {
          resolve();
        } else {
          setTimeout(checkConnections, 1000);
        }
      };
      checkConnections();
    });
  }

  private async terminateInstances(instances: Instance[]): Promise<void> {
    for (const instance of instances) {
      instance.status = 'terminated';
      this.instances.delete(instance.id);
      console.log(`🔚 Terminated instance: ${instance.id}`);
    }
  }

  // Health checking
  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.instances.values()).map(
      (instance) => this.performHealthCheck(instance)
    );

    await Promise.allSettled(healthCheckPromises);
  }

  private async performHealthCheck(instance: Instance): Promise<void> {
    try {
      // Simulate health check
      const responseTime = Math.random() * 100 + 50; // 50-150ms
      const isHealthy = Math.random() > 0.05; // 95% success rate

      await new Promise((resolve) => setTimeout(resolve, responseTime));

      if (
        isHealthy &&
        instance.status !== 'draining' &&
        instance.status !== 'terminated'
      ) {
        instance.status = 'healthy';
      } else if (instance.status === 'healthy') {
        instance.status = 'unhealthy';
        console.warn(`⚠️ Instance ${instance.id} failed health check`);
      }

      instance.lastHealthCheck = Date.now();
      this.updateInstanceMetrics(instance);
    } catch (error) {
      console.error(
        `❌ Health check failed for instance ${instance.id}:`,
        error
      );
      if (instance.status === 'healthy') {
        instance.status = 'unhealthy';
      }
    }
  }

  private updateInstanceMetrics(instance: Instance): void {
    // Simulate realistic metrics updates
    instance.metrics = {
      cpuUtilization: Math.max(
        0,
        Math.min(
          100,
          instance.metrics.cpuUtilization + (Math.random() - 0.5) * 10
        )
      ),
      memoryUtilization: Math.max(
        0,
        Math.min(
          100,
          instance.metrics.memoryUtilization + (Math.random() - 0.5) * 5
        )
      ),
      activeConnections: Math.max(
        0,
        instance.connections + Math.floor((Math.random() - 0.5) * 10)
      ),
      queueDepth: Math.max(
        0,
        instance.metrics.queueDepth + Math.floor((Math.random() - 0.5) * 5)
      ),
      responseTime: Math.max(
        10,
        instance.metrics.responseTime + (Math.random() - 0.5) * 50
      ),
      errorRate: Math.max(
        0,
        Math.min(1, instance.metrics.errorRate + (Math.random() - 0.5) * 0.01)
      ),
      throughput: Math.max(
        0,
        instance.metrics.throughput + (Math.random() - 0.5) * 20
      ),
      requestsPerSecond: Math.max(
        0,
        instance.metrics.requestsPerSecond + (Math.random() - 0.5) * 10
      ),
    };

    instance.connections = instance.metrics.activeConnections;
  }

  // Predictive scaling
  private predictMetricValue(metricType: keyof ScalingMetrics): number {
    const history = this.predictionModel.get(metricType) || [];
    if (history.length < 5) return 0; // Need enough data points

    // Simple linear regression prediction
    const x = history.map((_, index) => index);
    const y = history;

    const n = history.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, index) => sum + val * y[index], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict next value
    const nextX = n;
    return slope * nextX + intercept;
  }

  private updatePredictionModel(
    metricType: keyof ScalingMetrics,
    value: number
  ): void {
    const history = this.predictionModel.get(metricType) || [];
    history.push(value);

    // Keep only recent history (last 50 data points)
    if (history.length > 50) {
      history.shift();
    }

    this.predictionModel.set(metricType, history);
  }

  // Service methods
  private async startMetricsCollection(): Promise<void> {
    console.log('📊 Starting metrics collection for auto-scaling');

    setInterval(() => {
      this.collectScalingMetrics();
    }, 30000); // Collect every 30 seconds
  }

  private async startScalingEngine(): Promise<void> {
    console.log('⚖️ Starting scaling decision engine');

    setInterval(() => {
      this.evaluateScalingPolicies();
    }, 60000); // Evaluate every minute
  }

  private async startLoadBalancer(): Promise<void> {
    console.log('🔄 Starting intelligent load balancer');
    // Load balancer runs as part of instance selection
  }

  private async startHealthChecks(): Promise<void> {
    console.log('❤️ Starting health monitoring for auto-scaling');

    setInterval(() => {
      this.performHealthChecks();
    }, this.loadBalancerConfig.healthCheckInterval);
  }

  private async startPredictiveScaling(): Promise<void> {
    console.log('🔮 Starting predictive scaling engine');

    setInterval(() => {
      this.updatePredictiveModels();
    }, 300000); // Update every 5 minutes
  }

  private async startConnectionDraining(): Promise<void> {
    console.log('🚰 Starting connection draining manager');
    // Connection draining is handled during scale-down events
  }

  private async startScalingEventLogger(): Promise<void> {
    console.log('📝 Starting scaling event logger');

    setInterval(() => {
      this.cleanupOldEvents();
    }, 3600000); // Cleanup every hour
  }

  private collectScalingMetrics(): void {
    // Collect metrics from all instances for scaling decisions
    for (const instance of this.instances.values()) {
      if (instance.status === 'healthy') {
        // Update prediction models
        this.updatePredictionModel(
          'cpuUtilization',
          instance.metrics.cpuUtilization
        );
        this.updatePredictionModel(
          'memoryUtilization',
          instance.metrics.memoryUtilization
        );
        this.updatePredictionModel(
          'responseTime',
          instance.metrics.responseTime
        );
        this.updatePredictionModel('throughput', instance.metrics.throughput);
      }
    }
  }

  private updatePredictiveModels(): void {
    // Update machine learning models for predictive scaling
    console.log('🔮 Updating predictive scaling models');

    for (const metricType of [
      'cpuUtilization',
      'memoryUtilization',
      'responseTime',
    ] as const) {
      const prediction = this.predictMetricValue(metricType);
      if (prediction > 0) {
        console.log(`📈 Predicted ${metricType}: ${prediction.toFixed(2)}`);
      }
    }
  }

  private cleanupOldEvents(): void {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
    this.scalingEvents = this.scalingEvents.filter(
      (event) => event.timestamp > cutoff
    );
  }

  // Utility methods
  private initializeDefaultPolicies(): void {
    const defaultPolicies: ScalingPolicy[] = [
      {
        name: 'cpu-scaling',
        enabled: true,
        scaleUpThreshold: 70,
        scaleDownThreshold: 30,
        cooldownPeriod: 300000, // 5 minutes
        minInstances: 10, // 10x scale from 1
        maxInstances: 200, // 10x scale from 20
        stepSize: 10, // 10x scale from 1
        metricType: 'cpuUtilization',
        evaluationPeriods: 3,
        predictiveScaling: true,
      },
      {
        name: 'memory-scaling',
        enabled: true,
        scaleUpThreshold: 80,
        scaleDownThreshold: 40,
        cooldownPeriod: 300000,
        minInstances: 10,
        maxInstances: 150,
        stepSize: 5,
        metricType: 'memoryUtilization',
        evaluationPeriods: 2,
        predictiveScaling: true,
      },
      {
        name: 'response-time-scaling',
        enabled: true,
        scaleUpThreshold: 1000, // 1 second
        scaleDownThreshold: 200, // 200ms
        cooldownPeriod: 180000, // 3 minutes
        minInstances: 5,
        maxInstances: 100,
        stepSize: 3,
        metricType: 'responseTime',
        evaluationPeriods: 2,
        predictiveScaling: true,
      },
      {
        name: 'queue-depth-scaling',
        enabled: true,
        scaleUpThreshold: 50,
        scaleDownThreshold: 5,
        cooldownPeriod: 120000, // 2 minutes
        minInstances: 5,
        maxInstances: 300, // Higher for queue management
        stepSize: 15, // Aggressive scaling for queues
        metricType: 'queueDepth',
        evaluationPeriods: 1, // Fast response
        predictiveScaling: true,
      },
    ];

    for (const policy of defaultPolicies) {
      this.scalingPolicies.set(policy.name, policy);
    }

    console.log(
      `📋 Initialized ${defaultPolicies.length} default scaling policies`
    );
  }

  private initializeBaseInstances(): void {
    // Create initial set of instances for each type
    const instanceTypes = ['orchestrator', 'worker', 'cache', 'api'];
    const baseInstanceCounts = {
      orchestrator: 5, // 5x scale from 1
      worker: 20, // 10x scale from 2
      cache: 10, // 10x scale from 1
      api: 15, // 10x scale from 1.5
    };

    for (const instanceType of instanceTypes) {
      const count = baseInstanceCounts[instanceType] || 5;

      for (let i = 0; i < count; i++) {
        const instance: Instance = {
          id: `${instanceType}-base-${i}`,
          type: instanceType as any,
          status: 'healthy',
          createdAt: Date.now(),
          lastHealthCheck: Date.now(),
          metrics: this.createInitialMetrics(),
          connections: Math.floor(Math.random() * 20),
          weight: 100,
          zone: this.selectOptimalZone(),
          version: '1.0.0',
        };

        this.instances.set(instance.id, instance);
      }
    }

    console.log(`🏗️ Initialized ${this.instances.size} base instances`);
  }

  private createInitialMetrics(): ScalingMetrics {
    return {
      cpuUtilization: Math.random() * 30 + 20, // 20-50%
      memoryUtilization: Math.random() * 25 + 30, // 30-55%
      activeConnections: Math.floor(Math.random() * 50),
      queueDepth: Math.floor(Math.random() * 10),
      responseTime: Math.random() * 200 + 100, // 100-300ms
      errorRate: Math.random() * 0.01, // 0-1%
      throughput: Math.random() * 100 + 50, // 50-150 req/s
      requestsPerSecond: Math.random() * 80 + 20, // 20-100 req/s
    };
  }

  private selectOptimalZone(): string {
    const zones = ['us-east-1a', 'us-east-1b', 'us-east-1c'];
    return zones[Math.floor(Math.random() * zones.length)];
  }

  private getHealthyInstances(instanceType?: string): Instance[] {
    return Array.from(this.instances.values()).filter(
      (instance) =>
        instance.status === 'healthy' &&
        (!instanceType || instance.type === instanceType)
    );
  }

  private getInstancesByType(instanceType: string): Instance[] {
    return Array.from(this.instances.values()).filter(
      (instance) =>
        instance.type === instanceType && instance.status !== 'terminated'
    );
  }

  private getInstanceTypeForPolicy(policy: ScalingPolicy): string {
    // Map policies to instance types
    const policyTypeMapping = {
      'cpu-scaling': 'worker',
      'memory-scaling': 'cache',
      'response-time-scaling': 'api',
      'queue-depth-scaling': 'orchestrator',
    };

    return policyTypeMapping[policy.name] || 'worker';
  }

  private async getRecentMetrics(
    metricType: keyof ScalingMetrics,
    periods: number
  ): Promise<number[]> {
    // Simulate getting recent metric values
    const metrics: number[] = [];
    const instances = this.getHealthyInstances();

    for (let i = 0; i < periods; i++) {
      const avgMetric =
        instances.reduce(
          (sum, instance) => sum + instance.metrics[metricType],
          0
        ) / instances.length;
      metrics.push(avgMetric);
    }

    return metrics;
  }

  private calculateAverageMetric(metrics: number[]): number {
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, metric) => sum + metric, 0) / metrics.length;
  }

  private async updateLoadBalancer(): Promise<void> {
    // Update load balancer configuration with new instances
    console.log('🔄 Updating load balancer configuration');

    const healthyInstances = this.getHealthyInstances();
    console.log(
      `⚖️ Load balancer now managing ${healthyInstances.length} healthy instances`
    );
  }

  // Public interface
  getScalingStatus(): any {
    const instanceCounts = {
      orchestrator: this.getInstancesByType('orchestrator').length,
      worker: this.getInstancesByType('worker').length,
      cache: this.getInstancesByType('cache').length,
      api: this.getInstancesByType('api').length,
    };

    const healthyInstances = this.getHealthyInstances().length;
    const totalInstances = this.instances.size;

    return {
      isRunning: this.isRunning,
      totalInstances,
      healthyInstances,
      instanceCounts,
      activePolicies: this.scalingPolicies.size,
      lastScalingAction: this.lastScalingAction,
      recentEvents: this.scalingEvents.slice(-5),
    };
  }

  getLoadBalancerStatus(): any {
    const healthyInstances = this.getHealthyInstances();
    const totalConnections = healthyInstances.reduce(
      (sum, instance) => sum + instance.connections,
      0
    );
    const avgResponseTime =
      healthyInstances.reduce(
        (sum, instance) => sum + instance.metrics.responseTime,
        0
      ) / healthyInstances.length;

    return {
      algorithm: this.loadBalancerConfig.algorithm,
      healthyInstances: healthyInstances.length,
      totalConnections,
      avgResponseTime,
      healthCheckInterval: this.loadBalancerConfig.healthCheckInterval,
      connectionDraining: this.loadBalancerConfig.connectionDraining,
    };
  }

  getScalingEvents(limit: number = 50): ScalingEvent[] {
    return this.scalingEvents
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  getInstanceDetails(instanceId?: string): Instance | Instance[] {
    if (instanceId) {
      return this.instances.get(instanceId) || null;
    }
    return Array.from(this.instances.values());
  }

  // Manual scaling controls
  async manualScale(
    instanceType: string,
    targetCount: number
  ): Promise<boolean> {
    console.log(
      `🎛️ Manual scaling requested: ${instanceType} to ${targetCount} instances`
    );

    const currentInstances = this.getInstancesByType(instanceType);
    const currentCount = currentInstances.length;
    const difference = targetCount - currentCount;

    if (difference === 0) {
      console.log('⚖️ No scaling needed - already at target count');
      return true;
    }

    try {
      if (difference > 0) {
        await this.createInstances(instanceType, difference);
      } else {
        const instancesToTerminate = this.selectInstancesForTermination(
          instanceType,
          Math.abs(difference)
        );
        await this.terminateInstances(instancesToTerminate);
      }

      await this.updateLoadBalancer();

      console.log(
        `✅ Manual scaling completed: ${currentCount} -> ${targetCount} instances`
      );
      return true;
    } catch (error) {
      console.error(`❌ Manual scaling failed:`, error);
      return false;
    }
  }

  enablePolicy(policyName: string): boolean {
    const policy = this.scalingPolicies.get(policyName);
    if (!policy) return false;

    policy.enabled = true;
    console.log(`✅ Enabled scaling policy: ${policyName}`);
    return true;
  }

  disablePolicy(policyName: string): boolean {
    const policy = this.scalingPolicies.get(policyName);
    if (!policy) return false;

    policy.enabled = false;
    console.log(`⏸️ Disabled scaling policy: ${policyName}`);
    return true;
  }

  shutdown(): void {
    console.log('🔄 Shutting down auto-scaling system');
    this.isRunning = false;

    // Drain all connections gracefully
    const healthyInstances = this.getHealthyInstances();
    if (this.loadBalancerConfig.connectionDraining) {
      console.log('🚰 Draining connections from all instances');
      this.drainConnections(healthyInstances);
    }

    this.instances.clear();
    this.scalingPolicies.clear();
    this.scalingEvents = [];
  }
}

export default AutoScaler;
