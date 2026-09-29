const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL = process.env.TARGET_URL || 'https://zealous-river-220556.puter.site/';
const OUTPUT_DIR = path.join(__dirname, 'automation-results');

async function runAutomation() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = path.join(OUTPUT_DIR, `automation-${timestamp}.log`);
  const screenshotDir = path.join(OUTPUT_DIR, `screenshots-${timestamp}`);
  
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const log = (message) => {
    const entry = `[${new Date().toISOString()}] ${message}`;
    console.log(entry);
    fs.appendFileSync(logFile, entry + '\n');
  };

  log('🚀 Starting automation for ' + TARGET_URL);
  log('🎯 Target: Replicate user-provided JavaScript automation logic in Playwright');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  });

  const page = await context.newPage();

  // Enable console logging from the page (mirrors the user's console log overlay)
  page.on('console', msg => log(`📄 Console [${msg.type()}]: ${msg.text()}`));
  page.on('pageerror', err => log(`❌ Page Error: ${err.message}`));
  page.on('requestfailed', req => log(`🌐 Request Failed: ${req.url()} - ${req.failure()?.errorText}`));

  try {
    // Navigate to target URL
    log(`🌍 Navigating to ${TARGET_URL}`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
    
    await page.screenshot({ path: path.join(screenshotDir, '01-initial-load.png'), fullPage: true });
    log('📸 Screenshot: initial load');

    // Wait for page to be fully interactive
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // ============================================================
    // PHASE 1: FINALE FUNCTION - Coordinate-based CONFIRM clicking
    // ============================================================
    log('🔍 Phase 1 (finale): Looking for CONFIRM buttons with coordinate-based clicking...');
    
    const confirmSelectors = [
      'button[aria-label="CONFIRM"]',
      'button.css-1nnj36',
      '[aria-label="CONFIRM"]',
      'button:has-text("CONFIRM")',
      'button:has-text("Confirm")',
      'button:has-text("تأكيد")',
      'button:has-text("الموافقة")'
    ];

    // First, try to create the console log overlay like the user's JS
    await page.evaluate(() => {
      // Create console log display overlay (user's logContainer)
      if (document.getElementById('console-log-overlay')) return;
      
      const logContainer = document.createElement('div');
      logContainer.id = 'console-log-overlay';
      logContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 450px;
        height: 350px;
        background: rgba(20, 20, 20, 0.95);
        border: 2px solid #00ff00;
        border-radius: 8px;
        padding: 12px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #00ff00;
        overflow-y: auto;
        z-index: 99999;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
      `;
      
      const header = document.createElement('div');
      header.style.cssText = `
        font-weight: bold;
        margin-bottom: 10px;
        border-bottom: 1px solid #00ff00;
        padding-bottom: 5px;
        color: #00ff00;
      `;
      header.textContent = '📡 Console Logs & Coordinate Click';
      logContainer.appendChild(header);
      
      const logsDiv = document.createElement('div');
      logsDiv.id = 'console-logs-content';
      logsDiv.style.cssText = `
        max-height: 300px;
        overflow-y: auto;
      `;
      logContainer.appendChild(logsDiv);
      
      document.body.appendChild(logContainer);
      
      // Intercept console methods (user's override)
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalInfo = console.info;
      
      function addLogToDisplay(message, type = 'log') {
        const logEntry = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString();
        const colors = {
          'log': '#00ff00',
          'error': '#ff0000',
          'warn': '#ffaa00',
          'info': '#00aaff'
        };
        
        logEntry.style.cssText = `
          color: ${colors[type]};
          margin-bottom: 4px;
          word-wrap: break-word;
          white-space: pre-wrap;
          padding: 2px 0;
          border-left: 2px solid ${colors[type]};
          padding-left: 6px;
        `;
        logEntry.textContent = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        logsDiv.appendChild(logEntry);
        logsDiv.scrollTop = logsDiv.scrollHeight;
      }
      
      console.log = function(...args) {
        originalLog.apply(console, args);
        addLogToDisplay(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'log');
      };
      
      console.error = function(...args) {
        originalError.apply(console, args);
        addLogToDisplay(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'error');
      };
      
      console.warn = function(...args) {
        originalWarn.apply(console, args);
        addLogToDisplay(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'warn');
      };
      
      console.info = function(...args) {
        originalInfo.apply(console, args);
        addLogToDisplay(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'info');
      };
      
      console.log('🚀 Script started - coordinate-based click handler initialized');
      console.log('🎯 Target: button with aria-label="CONFIRM"');
      console.log('📍 Will calculate button center and simulate mouse click');
    });
    
    log('📺 Console log overlay injected into page');

    // Click by coordinates function (user's clickByCoordinates)
    async function clickByCoordinates(attempt = 1) {
      log(`🔄 Click attempt #${attempt} (coordinate-based)`);
      
      for (const selector of confirmSelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            const box = await element.boundingBox();
            if (box && box.width > 0 && box.height > 0) {
              log(`✅ Element found using: "${selector}"`);
              log(`  Position: top=${Math.round(box.y)}, left=${Math.round(box.x)}`);
              log(`  Size: width=${Math.round(box.width)}, height=${Math.round(box.height)}`);
              
              const x = box.x + box.width / 2;
              const y = box.y + box.height / 2;
              log(`  🎯 Click coordinates: X=${Math.round(x)}, Y=${Math.round(y)}`);
              
              // Verify element is visible
              if (box.width === 0 || box.height === 0) {
                log('❌ Element has no dimensions - might be hidden');
                return false;
              }
              
              const viewport = page.viewportSize();
              if (box.y < 0 || box.x < 0 || box.y + box.height > viewport.height || box.x + box.width > viewport.width) {
                log('⚠️  Element may be partially off-screen');
              }
              
              // Simulate real mouse movements and click (user's MouseEvent dispatch)
              try {
                await page.mouse.move(x, y);
                await page.mouse.down();
                await page.waitForTimeout(50);
                await page.mouse.up();
                await page.click(selector);
                
                log('✅ Coordinate-based mouse events dispatched successfully');
                
                // Verify what element is at those coordinates
                const elementAtPoint = await page.evaluate(([x, y]) => {
                  const el = document.elementFromPoint(x, y);
                  return el ? `${el.tagName}.${el.className}` : 'none';
                }, [x, y]);
                
                log(`  Verified: element at coordinates is: ${elementAtPoint}`);
                return true;
              } catch (e) {
                log(`❌ Error dispatching events: ${e.message}`);
                return false;
              }
            }
          }
        } catch (e) {
          log(`⚠️ Selector ${selector} failed: ${e.message}`);
        }
      }
      
      log(`❌ Element not found with any selector`);
      return false;
    }

    // Try immediately (user's immediate call)
    await clickByCoordinates(1);

    // Retry at 2 seconds (user's setTimeout)
    await page.waitForTimeout(2000);
    await clickByCoordinates(2);

    // Retry at 4 seconds
    await page.waitForTimeout(2000);
    await clickByCoordinates(3);

    // Final check at 6 seconds
    await page.waitForTimeout(2000);
    log('⏱️ 6 second mark reached - final attempt');
    await clickByCoordinates(4);

    await page.screenshot({ path: path.join(screenshotDir, '02-finale-phase-complete.png'), fullPage: true });

    // ============================================================
    // PHASE 2: NEXT FUNCTION - Linkvertise link conversion
    // ============================================================
    log('🔍 Phase 2 (next): Linkvertise link conversion detection...');
    
    await page.evaluate((LINKVERTISE_ID) => {
      // Check if Linkvertise script already loaded
      if (typeof window.linkvertise !== 'undefined') {
        console.log('Linkvertise already loaded');
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://publisher.linkvertise.com/cdn/linkvertise.js';
      script.async = true;
      script.onerror = () => console.error('Failed to load Linkvertise script');
      script.onload = () => {
        console.log('Linkvertise loaded successfully');
        try {
          if (typeof window.linkvertise === 'function') {
            window.linkvertise(LINKVERTISE_ID, { whitelist: [], blacklist: [] });
          }
        } catch (e) {
          console.error('Linkvertise initialization failed:', e);
        }
      };
      document.head.appendChild(script);
    }, '9578664'); // From user's DOMAIN_CONFIG for zealous-river-220556.puter.site
    
    // Wait for script to potentially load
    await page.waitForTimeout(3000);
    
    const linkvertiseStatus = await page.evaluate(() => {
      return {
        loaded: typeof window.linkvertise !== 'undefined',
        scriptPresent: document.querySelector('script[src*="linkvertise"]') !== null,
        convertedLinks: document.querySelectorAll('a.linkvertise').length
      };
    });
    
    log(`🔗 Linkvertise status: loaded=${linkvertiseStatus.loaded}, scriptPresent=${linkvertiseStatus.scriptPresent}, convertedLinks=${linkvertiseStatus.convertedLinks}`);

    // ============================================================
    // PHASE 3: LINK FUNCTION - Click body > a
    // ============================================================
    log('🔍 Phase 3 (link): Checking for body > a link...');
    
    const bodyLink = await page.$('body > a');
    if (bodyLink) {
      log('✅ Found body > a link, clicking...');
      await bodyLink.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(screenshotDir, '03-after-body-link-click.png'), fullPage: true });
    } else {
      log('ℹ️ No body > a link found');
    }

    // ============================================================
    // PHASE 4: FOLLOW FUNCTION - Click follow buttons
    // ============================================================
    log('🔍 Phase 4 (follow): Looking for follow/profile suggestion buttons...');
    
    // User's specific lv-* selectors for follow buttons
    const followSelectors = [
      'body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-link-detail-page > lv-main-content-layout > div > div.widgets > div.widget__sticky > div > lv-profile-suggestions > lv-lib-card > div > div > div > div:nth-child(1) > lv-lib-button > button',
      'body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-link-detail-page > lv-main-content-layout > div > div.widgets > div.widget__sticky > div > lv-profile-suggestions > lv-lib-card > div > div > div > div:nth-child(2) > lv-lib-button > button',
      'body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-link-detail-page > lv-main-content-layout > div > div.widgets > div.widget__sticky > div > lv-profile-suggestions > lv-lib-card > div > div > div > div:nth-child(3) > lv-lib-button > button',
      'lv-lib-button button',
      'button:has-text("Follow")',
      'button:has-text("متابعة")',
      'button:has-text("Subscribe")',
      'button:has-text("الاشتراك")',
      '[class*="follow"] button',
      '[class*="subscribe"] button'
    ];

    for (const selector of followSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          log(`✅ Found follow button with: ${selector}`);
          await element.click();
          await page.waitForTimeout(1000);
          await page.screenshot({ path: path.join(screenshotDir, '04-after-follow-click.png'), fullPage: true });
          break;
        }
      } catch (e) {
        log(`⚠️ Follow selector ${selector} failed: ${e.message}`);
      }
    }

    // ============================================================
    // PHASE 5: ACCESS PAGE BUTTONS - Content, membership, etc.
    // ============================================================
    log('🔍 Phase 5: Checking for access/content page buttons (20s-40s delays)...');
    
    // User's specific selector at ~20 seconds
    try {
      const selector20s = 'body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-link-detail-page > lv-main-content-layout > div > div.content > div > lv-link-content > div > div:nth-child(2) > lv-fullsize-result-component > lv-lib-card > div > div > div > div.lv-card__footer > div.--button-container > div.button-desktop > a > lv-lib-button > button';
      const element20s = await page.$(selector20s);
      if (element20s) {
        log('✅ Found 20s access button, clicking...');
        await element20s.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(screenshotDir, '05-after-20s-click.png'), fullPage: true });
      }
    } catch (e) {
      log(`⚠️ 20s selector failed: ${e.message}`);
    }

    // User's specific selector at ~30 seconds (membership selection)
    await page.waitForTimeout(5000);
    try {
      const selector30s = 'body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-wait > lv-membership-selection-card > lv-lib-card > div > div > div > div.membership-plan-selection__plans > lv-membership-plan-option:nth-child(5) > div > div';
      const element30s = await page.$(selector30s);
      if (element30s) {
        log('✅ Found 30s membership option (5th), clicking...');
        await element30s.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(screenshotDir, '06-after-30s-click.png'), fullPage: true });
      }
    } catch (e) {
      log(`⚠️ 30s selector failed: ${e.message}`);
    }

    // User's specific selector at ~40 seconds (access button)
    await page.waitForTimeout(5000);
    try {
      const selector40s = 'body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-wait > lv-membership-selection-card > lv-lib-card > div > div > div > div.membership-plan-selection__button.membership-plan-selection__button--access.ng-star-inserted > lv-lib-button > button';
      const element40s = await page.$(selector40s);
      if (element40s) {
        log('✅ Found 40s access button, clicking...');
        await element40s.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(screenshotDir, '07-after-40s-click.png'), fullPage: true });
      }
    } catch (e) {
      log(`⚠️ 40s selector failed: ${e.message}`);
    }

    // ============================================================
    // PHASE 6: SKIP FUNCTION - Skip buttons (ads)
    // ============================================================
    log('🔍 Phase 6 (skip): Looking for skip buttons (70s-130s delays)...');
    
    const skipSelectors = [
      'body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-ad-experiment > lv-task-ad-stepper-line > lv-ad-step-nonskip > lv-fullsize-result-component > lv-lib-card > div > div > div > div.lv-card__body > lv-lib-carousel > div > div.skip-button.ng-star-inserted > lv-lib-chip > div',
      '.skip-button',
      'lv-lib-chip:has-text("Skip")',
      'button:has-text("Skip")',
      'button:has-text("تخطي")',
      'button:has-text("تجاوز")',
      '[class*="skip"] button'
    ];

    // Try at 70s mark (simulated with shorter delay)
    await page.waitForTimeout(3000);
    for (const selector of skipSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          log(`✅ Found skip button at 70s mark with: ${selector}`);
          await element.click();
          await page.waitForTimeout(1000);
          await page.screenshot({ path: path.join(screenshotDir, '08-after-70s-skip.png'), fullPage: true });
          break;
        }
      } catch (e) {
        log(`⚠️ Skip selector ${selector} failed: ${e.message}`);
      }
    }

    // Try at 100s mark
    await page.waitForTimeout(3000);
    for (const selector of skipSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          log(`✅ Found skip button at 100s mark with: ${selector}`);
          await element.click();
          await page.waitForTimeout(1000);
          await page.screenshot({ path: path.join(screenshotDir, '09-after-100s-skip.png'), fullPage: true });
          break;
        }
      } catch (e) {
        log(`⚠️ Skip selector ${selector} failed: ${e.message}`);
      }
    }

    // Try at 130s mark
    await page.waitForTimeout(3000);
    for (const selector of skipSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          log(`✅ Found skip button at 130s mark with: ${selector}`);
          await element.click();
          await page.waitForTimeout(1000);
          await page.screenshot({ path: path.join(screenshotDir, '10-after-130s-skip.png'), fullPage: true });
          break;
        }
      } catch (e) {
        log(`⚠️ Skip selector ${selector} failed: ${e.message}`);
      }
    }

    // ============================================================
    // PHASE 7: SUCCESS PAGE - window.open patch + final button
    // ============================================================
    log('🔍 Phase 7: Success page handling (150s mark)...');
    
    // Inject window.open patch (user's patch)
    await page.addInitScript(() => {
      // Patch 1: intercept window.open
      const originalOpen = window.open;
      window.open = function (url, target, features) {
        if (url) {
          window.location.href = url;
          return null;
        }
        return originalOpen.apply(window, arguments);
      };

      // Patch 2: intercept anchor clicks that target a new tab
      const originalAnchorClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () {
        if (this.target === "_blank" && this.href) {
          window.location.href = this.href;
          return;
        }
        return originalAnchorClick.call(this);
      };
    });
    
    log('🔧 window.open and anchor click patches injected');

    // Wait for success page (simulated shorter delay)
    await page.waitForTimeout(3000);

    // User's success button selector
    try {
      const successSelector = 'body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-success-page > lv-main-content-layout > div > div.content > div > lv-success-variant-a > div > lv-lib-card:nth-child(2) > div > div > div > div > lv-lib-button > button';
      const successBtn = await page.$(successSelector);
      
      if (successBtn) {
        log('✅ Found success page button, clicking...');
        await successBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(screenshotDir, '11-after-success-click.png'), fullPage: true });
      } else {
        log('ℹ️ Success button not found, trying generic selectors...');
        const genericSelectors = [
          'lv-success-page lv-lib-button button',
          'lv-success-variant-a lv-lib-button button',
          'button:has-text("Done")',
          'button:has-text("Finish")',
          'button:has-text("Complete")'
        ];
        for (const selector of genericSelectors) {
          const el = await page.$(selector);
          if (el) {
            log(`✅ Found success button with generic selector: ${selector}`);
            await el.click();
            await page.waitForTimeout(2000);
            await page.screenshot({ path: path.join(screenshotDir, '11-after-success-click.png'), fullPage: true });
            break;
          }
        }
      }
    } catch (e) {
      log(`⚠️ Success button click failed: ${e.message}`);
    }

    // ============================================================
    // PHASE 8: FINALE LOOP - Repeat every ~200 seconds (simulated)
    // ============================================================
    log('🔍 Phase 8: Finale loop simulation (would repeat every ~200s)...');
    
    // In the real automation, this would be an interval. For GitHub Actions,
    // we run once per workflow execution. The cron schedule handles the 5-min repeats.
    log('ℹ️ Single execution complete. Cron schedule (every 5 min) handles repetition.');

    // Final screenshot
    await page.screenshot({ path: path.join(screenshotDir, '12-final-state.png'), fullPage: true });
    
    // Get final page info
    const finalUrl = page.url();
    const title = await page.title();
    log(`🏁 Final URL: ${finalUrl}`);
    log(`📄 Final Title: ${title}`);

    // Save page HTML for analysis
    const html = await page.content();
    fs.writeFileSync(path.join(OUTPUT_DIR, `page-${timestamp}.html`), html);
    log(`💾 Saved page HTML and screenshots to ${OUTPUT_DIR}`);

  } catch (error) {
    log(`💥 Automation error: ${error.message}`);
    log(`💥 Stack: ${error.stack}`);
    try {
      await page.screenshot({ path: path.join(screenshotDir, 'error-state.png'), fullPage: true });
    } catch (e) {
      log(`💥 Failed to capture error screenshot: ${e.message}`);
    }
    throw error;
  } finally {
    await browser.close();
    log('🔚 Browser closed');
    log('✅ Automation completed');
  }
}

// Run the automation
runAutomation()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });