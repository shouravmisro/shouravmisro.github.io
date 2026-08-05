export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "SQA" | "IoT" | "Engineering";
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  content: string;
}

export const blogs: BlogPost[] = [
  {
    id: "blog_1",
    slug: "effective-test-case-design-and-bug-lifecycle",
    title: "Effective Test Case Design & Bug Lifecycle Management",
    description: "A practical guide to writing robust, reproducible manual test cases and structuring defect reports in Jira for software QA.",
    category: "SQA",
    date: "Feb 02, 2025",
    readTime: "5 min read",
    author: "Shourav Misro",
    tags: ["Manual Testing", "Test Cases", "Jira", "STLC"],
    content: `
### Introduction to Test Case Design

In Software Quality Assurance (SQA), effective test case design is the foundation of high-value testing. Well-structured test cases enable QA testers, developers, and project managers to maintain consistency, track coverage, and ensure regression readiness.

### Key Principles of Quality Test Cases

1. **Clarity and Precision**: Each test case must have unambiguous step-by-step instructions and expected outcomes.
2. **Precondition Identification**: Clearly state system state (e.g., user authentication, database seed) before executing test steps.
3. **Boundary Value Analysis (BVA)**: Test extreme limits (e.g., minimum character length, maximum payload size, negative input strings).
4. **Equivalence Partitioning**: Group inputs into valid and invalid sets to minimize redundant test execution while keeping coverage high.

### Bug Lifecycle in Jira

When a test case fails, logging a clear defect report accelerates triage and resolution:

\`\`\`text
[Title]: [Module] Short summary of failure behavior
[Environment]: Staging Build v1.4.2 (Browser: Chrome 122)
[Severity]: High | [Priority]: High
[Steps to Reproduce]:
 1. Navigate to /checkout
 2. Select standard shipping
 3. Click "Apply Coupon Code" without entering input
[Expected Result]: Validation error message appears asking for coupon code.
[Actual Result]: Application throws 500 Internal Server Error modal.
\`\`\`

### Verification & Closure

Once developers submit a fix, the QA engineer verifies against the reproduction steps, logs execution evidence, executes smoke tests on adjacent modules, and transitions the Jira ticket to **Closed**.
    `
  },
  {
    id: "blog_2",
    slug: "api-testing-postman-validation-strategies",
    title: "API Validation Strategies with Postman & Automated Collections",
    description: "How to structure Postman test suites, write JavaScript assertions, validate JSON schemas, and test RESTful endpoints.",
    category: "SQA",
    date: "Jan 18, 2025",
    readTime: "6 min read",
    author: "Shourav Misro",
    tags: ["API Testing", "Postman", "REST API", "Automation"],
    content: `
### Why API Validation Matters

Backend API testing ensures business logic, data integrity, and authentication mechanisms function reliably independent of frontend rendering. Catching API regressions early prevents cascade failures across web and mobile clients.

### Structuring Postman Collections

Organize collections by API domain resources:
- **Authentication**: \`POST /api/v1/auth/login\`
- **User Management**: \`GET /api/v1/users\`, \`PUT /api/v1/users/:id\`
- **Orders & Inventory**: \`POST /api/v1/orders\`

### Writing Robust Postman Assertions

Postman allows embedded JavaScript testing inside the **Tests** tab of each request:

\`\`\`javascript
// Validate Status Code 200 OK
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Validate Response Time Under 500ms
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Validate JSON Response Schema & Fields
pm.test("User object contains expected fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});
\`\`\`

### Running Automated Test Runs

Utilize Postman Collection Runner or Newman CLI in integration environments to execute regression runs and export automated JUnit/HTML reports.
    `
  },
  {
    id: "blog_3",
    slug: "esp32-mqtt-realtime-telemetry-pipeline",
    title: "Building Low-Power ESP32 Telemetry Pipelines with MQTT & Edge Filtering",
    description: "Designing reliable IoT sensor nodes using ESP32, MQTT protocols, low-power deep sleep cycles, and edge data smoothing.",
    category: "IoT",
    date: "Jan 28, 2025",
    readTime: "7 min read",
    author: "Shourav Misro",
    tags: ["ESP32", "MQTT", "Embedded C", "Sensors"],
    content: `
### Architecture Overview

Microcontroller-based IoT deployment requires balancing power consumption, wireless connectivity, and transmission efficiency. Using the ESP32 with MQTT protocol allows for lightweight pub/sub messaging over Wi-Fi.

### ESP32 Wi-Fi & MQTT Client Implementation

\`\`\`cpp
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
    delay(10);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }
}

void publishTelemetry(float temp, float humidity) {
    char payload[128];
    snprintf(payload, sizeof(payload), "{\\"temp\\":%.2f, \\"humidity\\":%.2f}", temp, humidity);
    client.publish("home/sensors/climate", payload);
}
\`\`\`

### Sensor Data Smoothing & Noise Filtering

Raw analog inputs from environmental sensors frequently exhibit electrical noise. Implementing a moving average filter directly on the microcontroller edge reduces bogus telemetry triggers:

\`\`\`cpp
float applyMovingAverage(float newReading, float* buffer, int size) {
    float sum = 0.0;
    for (int i = size - 1; i > 0; i--) {
        buffer[i] = buffer[i - 1];
        sum += buffer[i];
    }
    buffer[0] = newReading;
    sum += newReading;
    return sum / size;
}
\`\`\`

### Deep Sleep Power Optimization

To extend battery runtime, configured hardware timers send ESP32 microcontrollers into Deep Sleep modes, reducing power draw to under 10µA between publishing intervals.
    `
  },
  {
    id: "blog_4",
    slug: "debugging-hardware-interrupts-and-timers-esp32",
    title: "Debugging Hardware Interrupts and Timers on ESP32 & Arduino",
    description: "Techniques for handling hardware interrupts safely, debouncing physical pushbuttons, and managing high-frequency hardware timers.",
    category: "IoT",
    date: "Dec 14, 2024",
    readTime: "6 min read",
    author: "Shourav Misro",
    tags: ["Firmware", "Interrupts", "Embedded C", "Arduino"],
    content: `
### Understanding Hardware Interrupts

Interrupt Service Routines (ISRs) allow microcontrollers to react immediately to external electrical signals (such as motion detection or pulse counters) without polling pins inside the main loop.

### Writing Safe ISR Code in Embedded C

1. Keep ISR functions minimal and fast.
2. Mark shared variables with the \`volatile\` keyword.
3. Place ISR functions in IRAM using \`IRAM_ATTR\` on ESP32 target chips.

\`\`\`cpp
#define BUTTON_PIN 14

volatile unsigned long lastDebounceTime = 0;
volatile bool eventDetected = false;

void IRAM_ATTR handleButtonInterrupt() {
    unsigned long currentTime = millis();
    if (currentTime - lastDebounceTime > 200) { // 200ms software debounce
        eventDetected = true;
        lastDebounceTime = currentTime;
    }
}

void setup() {
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), handleButtonInterrupt, FALLING);
}
\`\`\`

### Common Firmware Pitfalls

- **Watchdog Timer (WDT) Resets**: Blocking ISR operations or failing to yield control can cause hardware watchdog triggers.
- **Floating Inputs**: Always use \`INPUT_PULLUP\` or external pull-down resistors to prevent erratic interrupt firing caused by electromagnetic noise.
    `
  },
  {
    id: "blog_5",
    slug: "bridging-sqa-and-embedded-systems",
    title: "Bridging Software QA & Embedded Engineering for Reliable Edge Systems",
    description: "Combining software testing methodologies (boundary testing, stress testing, test matrices) with embedded firmware and hardware validation.",
    category: "Engineering",
    date: "Feb 01, 2025",
    readTime: "5 min read",
    author: "Shourav Misro",
    tags: ["QA", "IoT", "System Validation", "Hardware-in-the-Loop"],
    content: `
### The Intersection of QA and Embedded Systems

Traditional software QA focuses on UI flows and web APIs, whereas embedded engineering focuses on register-level programming and circuit stability. Bridging these domains enables Hardware-in-the-Loop (HIL) testing and robust edge systems.

### Applying QA Principles to Microcontroller Firmware

1. **Boundary & Corner Case Testing**: Testing microcontroller behavior when operating voltage fluctuates or Wi-Fi drops mid-transmission.
2. **Stress & Fault Injection Testing**: Deliberately disconnecting sensors or overwhelming communication buses (UART/SPI) to verify graceful error recovery.
3. **Automated Firmware Regression Tests**: Running unit tests over serial interface wrappers before flashing microcontrollers for deployment.

### Systemic Reliability Outcomes

Combining software validation precision with physical microcontrollers produces edge systems that resist crash states, auto-heal connection drops, and deliver long-term field stability.
    `
  },
  {
    id: "blog_6",
    slug: "building-optimal-solar-monitoring-with-esp32-and-jetson",
    title: "Building an AI-Assisted Solar Panel Tracker with ESP32 & Jetson Nano",
    description: "Technical build details of an ESP32 and Jetson Nano solar monitoring ecosystem featuring sensors, PWM charge regulation, and edge defect detection.",
    category: "Engineering",
    date: "Jan 10, 2025",
    readTime: "8 min read",
    author: "Shourav Misro",
    tags: ["IoT", "AI", "ESP32", "Jetson Nano", "Hardware"],
    content: `
### Project Context & Goal

Solar power tracking requires real-time electrical telemetry (voltage, current, power generation) paired with dynamic tilt adjustment and automated thermal/defect monitoring.

### Dual-Controller Architecture

- **ESP32 Node**: Handles low-level current/voltage sensing via INA219 modules, PWM solar charge controller regulation, and relay isolation safety triggers.
- **Jetson Nano Computer**: Runs lightweight computer vision models to detect surface dust accumulation or physical cell degradation from camera feeds.

### Hardware Interfacing & Safety Logic

\`\`\`cpp
// Over-voltage protection safety logic in ESP32 firmware
void checkVoltageThresholds(float voltage) {
    if (voltage > MAX_SAFE_VOLTAGE) {
        digitalWrite(RELAY_DISCONNECT_PIN, HIGH); // Isolate solar array
        logTelemetryError("Over-voltage fault detected. Array disconnected.");
    }
}
\`\`\`

### Results & Field Performance

The hybrid system demonstrated high power efficiency gains, real-time power metric visualization, and reliable hardware fault protection.
    `
  }
];

export function getBlogPosts(): BlogPost[] {
  let cmsPosts: BlogPost[] = [];
  try {
    const glob1 = import.meta.glob('/src/content/blogs/*.md', { eager: true });
    const glob2 = import.meta.glob('../content/blogs/*.md', { eager: true });
    const glob = { ...glob1, ...glob2 };
    
    cmsPosts = Object.entries(glob).map(([filepath, file]: [string, any], index: number) => {
      const fm = file.frontmatter || {};
      
      const filename = filepath.split('/').pop()?.replace('.md', '') || `cms-post-${index}`;
      const slug = fm.slug || filename;
      
      let contentHtml = '';
      try {
        if (typeof file.compiledContent === 'function') {
          contentHtml = file.compiledContent();
        } else if (typeof file.rawContent === 'function') {
          contentHtml = file.rawContent();
        } else if (file.default && typeof file.default === 'string') {
          contentHtml = file.default;
        } else {
          contentHtml = fm.description || '';
        }
      } catch (err) {
        contentHtml = fm.description || '';
      }

      if (typeof contentHtml !== 'string') {
        contentHtml = String(contentHtml || '');
      }

      return {
        id: slug,
        slug: slug,
        title: fm.title || 'Untitled',
        description: fm.description || '',
        category: fm.category || 'Engineering',
        date: fm.date || '2026',
        readTime: fm.readTime || '5 min read',
        author: fm.author || 'Shourav Misro',
        tags: Array.isArray(fm.tags) ? fm.tags : [],
        content: contentHtml
      };
    });
  } catch (e) {
    console.error('Error loading CMS posts:', e);
    cmsPosts = [];
  }
  
  const cmsSlugs = new Set(cmsPosts.map(p => p.slug));
  const fallbackPosts = blogs.filter(b => !cmsSlugs.has(b.slug));
  
  return [...cmsPosts, ...fallbackPosts];
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const all = getBlogPosts();
  return all.find((b) => b.slug === slug);
}

export function getBlogPostsByCategory(category?: string): BlogPost[] {
  const all = getBlogPosts();
  if (!category || category === "All") return all;
  return all.filter((b) => b.category.toLowerCase() === category.toLowerCase());
}
