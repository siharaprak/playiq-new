# Sprint 4B — Manual QA Script
# Run these curl commands against http://localhost:3000 with npm run dev running
# You need to be logged in as a student first to get a valid cookie

# ============================================================
# SETUP: Get your auth cookie
# ============================================================
# 1. Open http://localhost:3000/login in your browser
# 2. Log in as a student
# 3. Open DevTools > Application > Cookies
# 4. Copy the full cookie string (sb-* cookies)
# 5. Replace AUTH_COOKIE below with your actual cookie value

$COOKIE = "YOUR_AUTH_COOKIE_HERE"
$BASE = "http://localhost:3000"
$HEADERS = @{ "Content-Type" = "application/json"; "Cookie" = $COOKIE }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST 1: Lesson Rescue - Missing input asks for confusing sentence" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$body1 = '{"mode":"lesson_rescue","moduleNumber":1,"nodeId":"1","message":"help","pageType":"lesson"}'
$r1 = Invoke-RestMethod -Uri "$BASE/api/guided-ai" -Method POST -Headers $HEADERS -Body $body1
Write-Host "integrityAction: $($r1.data.integrityAction)" -ForegroundColor Yellow
Write-Host "response: $($r1.data.response)" -ForegroundColor White
# EXPECTED: integrityAction = "refused", response mentions "paste" or "confusing sentence"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST 2: Lesson Rescue - Confusing excerpt returns diagnosis" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$body2 = '{"mode":"lesson_rescue","moduleNumber":1,"nodeId":"1","message":"I don''t understand what AI hallucination means and why it matters for checking AI output","selectedText":"AI systems can hallucinate, meaning they generate plausible-sounding but incorrect information with high confidence.","pageType":"lesson"}'
$r2 = Invoke-RestMethod -Uri "$BASE/api/guided-ai" -Method POST -Headers $HEADERS -Body $body2
Write-Host "integrityAction: $($r2.data.integrityAction)" -ForegroundColor Yellow
Write-Host "mode: $($r2.data.mode)" -ForegroundColor Yellow
if ($r2.data.lessonRescue) {
  Write-Host "confusionType: $($r2.data.lessonRescue.confusionType)" -ForegroundColor Green
  Write-Host "gapDiagnosis: $($r2.data.lessonRescue.gapDiagnosis)" -ForegroundColor Green
  Write-Host "rescueExplanation: $($r2.data.lessonRescue.rescueExplanation)" -ForegroundColor Green
  Write-Host "microExample: $($r2.data.lessonRescue.microExample)" -ForegroundColor Green
  Write-Host "checkQuestion: $($r2.data.lessonRescue.checkQuestion)" -ForegroundColor Green
  Write-Host "teachBackPrompt: $($r2.data.lessonRescue.teachBackPrompt)" -ForegroundColor Green
  Write-Host "nextStep: $($r2.data.lessonRescue.nextStep)" -ForegroundColor Green
} else {
  Write-Host "WARNING: lessonRescue object missing!" -ForegroundColor Red
  Write-Host "response: $($r2.data.response)" -ForegroundColor White
}
# EXPECTED: lessonRescue object present with all fields

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST 3: Direct answer request is refused" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$body3 = '{"mode":"lesson_rescue","moduleNumber":1,"nodeId":"1","message":"just give me the answer to the homework question","pageType":"lesson"}'
$r3 = Invoke-RestMethod -Uri "$BASE/api/guided-ai" -Method POST -Headers $HEADERS -Body $body3
Write-Host "integrityAction: $($r3.data.integrityAction)" -ForegroundColor Yellow
Write-Host "response: $($r3.data.response)" -ForegroundColor White
# EXPECTED: integrityAction = "refused"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST 4: Quiz answer request is refused" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$body4 = '{"mode":"lesson_rescue","moduleNumber":1,"nodeId":"1","message":"what is the quiz answer for question 3","pageType":"lesson"}'
$r4 = Invoke-RestMethod -Uri "$BASE/api/guided-ai" -Method POST -Headers $HEADERS -Body $body4
Write-Host "integrityAction: $($r4.data.integrityAction)" -ForegroundColor Yellow
Write-Host "response: $($r4.data.response)" -ForegroundColor White
# EXPECTED: integrityAction = "refused"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST 5: Homework outsourcing is refused" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$body5 = '{"mode":"lesson_rescue","moduleNumber":1,"nodeId":"1","message":"do my homework for me please I need to finish this assignment","pageType":"lesson"}'
$r5 = Invoke-RestMethod -Uri "$BASE/api/guided-ai" -Method POST -Headers $HEADERS -Body $body5
Write-Host "integrityAction: $($r5.data.integrityAction)" -ForegroundColor Yellow
Write-Host "response: $($r5.data.response)" -ForegroundColor White
# EXPECTED: integrityAction = "refused"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST 6: Explain mode still works" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$body6 = '{"mode":"explain","moduleNumber":1,"nodeId":"1","message":"explain what AI hallucination means","pageType":"lesson"}'
$r6 = Invoke-RestMethod -Uri "$BASE/api/guided-ai" -Method POST -Headers $HEADERS -Body $body6
Write-Host "mode: $($r6.data.mode), integrityAction: $($r6.data.integrityAction)" -ForegroundColor Yellow
Write-Host "response: $($r6.data.response.Substring(0, [Math]::Min(200, $r6.data.response.Length)))..." -ForegroundColor White
# EXPECTED: mode = "explain", valid response

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST 7: Hint mode still works" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$body7 = '{"mode":"hint","moduleNumber":1,"nodeId":"1","message":"I''m stuck on understanding the difference between AI and machine learning","pageType":"lesson"}'
$r7 = Invoke-RestMethod -Uri "$BASE/api/guided-ai" -Method POST -Headers $HEADERS -Body $body7
Write-Host "mode: $($r7.data.mode), integrityAction: $($r7.data.integrityAction)" -ForegroundColor Yellow
Write-Host "response: $($r7.data.response.Substring(0, [Math]::Min(200, $r7.data.response.Length)))..." -ForegroundColor White
# EXPECTED: mode = "hint", valid response

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST 8: Quiz mode still works" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$body8 = '{"mode":"quiz","moduleNumber":1,"nodeId":"1","message":"quiz me on what AI is good at versus bad at","pageType":"lesson"}'
$r8 = Invoke-RestMethod -Uri "$BASE/api/guided-ai" -Method POST -Headers $HEADERS -Body $body8
Write-Host "mode: $($r8.data.mode), integrityAction: $($r8.data.integrityAction)" -ForegroundColor Yellow
Write-Host "response: $($r8.data.response.Substring(0, [Math]::Min(200, $r8.data.response.Length)))..." -ForegroundColor White
# EXPECTED: mode = "quiz", practiceItems present

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST 9: Coach mode still works" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$body9 = '{"mode":"coach","moduleNumber":1,"nodeId":"1","message":"help me plan how to study for this module effectively","pageType":"lesson"}'
$r9 = Invoke-RestMethod -Uri "$BASE/api/guided-ai" -Method POST -Headers $HEADERS -Body $body9
Write-Host "mode: $($r9.data.mode), integrityAction: $($r9.data.integrityAction)" -ForegroundColor Yellow
Write-Host "response: $($r9.data.response.Substring(0, [Math]::Min(200, $r9.data.response.Length)))..." -ForegroundColor White
# EXPECTED: mode = "coach", valid response

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST 10: Learn Your Way still works" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$body10 = '{"mode":"learn_your_way","moduleNumber":1,"message":"Help me discover my learning style","preferences":{"explanation_style":"examples","pace_preference":"moderate"}}'
$r10 = Invoke-RestMethod -Uri "$BASE/api/guided-ai" -Method POST -Headers $HEADERS -Body $body10
Write-Host "mode: $($r10.data.mode), integrityAction: $($r10.data.integrityAction)" -ForegroundColor Yellow
Write-Host "response: $($r10.data.response.Substring(0, [Math]::Min(200, $r10.data.response.Length)))..." -ForegroundColor White
# EXPECTED: mode = "learn_your_way", valid response

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST 11: Unauthenticated request rejected" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
try {
  $body11 = '{"mode":"lesson_rescue","moduleNumber":1,"message":"test"}'
  $r11 = Invoke-RestMethod -Uri "$BASE/api/guided-ai" -Method POST -ContentType "application/json" -Body $body11
  Write-Host "WARNING: Should have been rejected!" -ForegroundColor Red
} catch {
  Write-Host "Correctly rejected unauthenticated request: $($_.Exception.Response.StatusCode)" -ForegroundColor Green
}
# EXPECTED: 401 Unauthorized

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "QA COMPLETE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
