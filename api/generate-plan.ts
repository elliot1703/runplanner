import type { VercelRequest, VercelResponse } from '@vercel/node'

interface Store {
  id: string
  name: string
  suburb: string
  tier: 'A' | 'B' | 'C' | 'D'
  frequency: 'twice-weekly' | 'weekly' | 'fortnightly' | 'monthly'
  monthlySpend: number
  newLinesThisMonth: number
  notes?: string
  rescheduledCount: number
}

const FREQUENCY_VISITS: Record<string, number> = {
  'twice-weekly': 8,
  'weekly': 4,
  'fortnightly': 2,
  'monthly': 1,
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { stores, homeSuburb, workDays, blockedDays, month, year, apiKey } = req.body

  if (!apiKey) {
    return res.status(400).json({ error: 'API key required' })
  }
  if (!stores || stores.length === 0) {
    return res.status(400).json({ error: 'No stores provided' })
  }

  // Build the prompt
  const storeDescriptions = (stores as Store[])
    .sort((a, b) => {
      const tierOrder = { A: 0, B: 1, C: 2, D: 3 }
      return tierOrder[a.tier] - tierOrder[b.tier] || b.monthlySpend - a.monthlySpend
    })
    .map(s => {
      const score = s.monthlySpend + (s.newLinesThisMonth * 500)
      return `- ${s.name} (${s.suburb}) | Tier ${s.tier} | ${s.frequency} (${FREQUENCY_VISITS[s.frequency]} visits/month) | Spend: $${s.monthlySpend}/mo | New lines: ${s.newLinesThisMonth} | Score: ${score} | Rescheduled this month: ${s.rescheduledCount}x | ID: ${s.id}${s.notes ? ` | Notes: ${s.notes}` : ''}`
    })
    .join('\n')

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const workDayNames = (workDays as number[]).map(d => dayNames[d]).join(', ')

  // Calculate all work days for the month
  const monthDate = new Date(year, month, 1)
  const monthName = monthDate.toLocaleString('en-AU', { month: 'long', year: 'numeric' })

  const prompt = `You are a route planning assistant for a field sales representative covering North Brisbane to the Sunshine Coast (Noosa).

## Task
Generate an optimized monthly visit schedule for ${monthName}.

## Constraints
- Work days: ${workDayNames}
- Home base: ${homeSuburb} (start and end each day here)
- Blocked days (no visits): ${(blockedDays as string[]).length > 0 ? (blockedDays as string[]).join(', ') : 'None'}
- Geographic corridor: North Brisbane → Caboolture → Sunshine Coast → Noosa (roughly north-south along the Bruce Highway / M1)

## Stores to Schedule
${storeDescriptions}

## Scheduling Rules
1. **Tier Priority:** Schedule Tier A stores first on their preferred consistent days. Then B, C, D.
2. **Frequency:** Each store must appear exactly the number of times dictated by its frequency.
3. **Geographic Grouping:** Group stores in the same suburb or nearby suburbs on the same day.
   - North Brisbane suburbs (North Lakes, Redcliffe, Caboolture, Morayfield) should cluster together
   - Mid-coast suburbs (Caloundra, Maroochydore, Mooloolaba) should cluster together
   - Northern coast suburbs (Noosa, Coolum, Nambour) should cluster together
4. **Route Order:** Within each day, order visits from south to north (leaving from ${homeSuburb}) or north to south (returning), whichever is more efficient. The rep should not zigzag.
5. **Even Distribution:** Spread visits evenly across work days. Aim for 3-5 stores per day. Never exceed 6.
6. **Consistency:** Tier A and B stores should ideally be on the same day each week for relationship building.
7. **Blocked Days:** Never schedule visits on blocked days. If a blocked day has existing visits, those stores should be redistributed following the rescheduling priority.
8. **Rescheduling Priority:** When space is tight, bump lowest priority first: Tier D (lowest score) → Tier C (lowest score) → Tier B → Tier A. Use rescheduledCount as tiebreaker (bump the store with lower reschedule count to spread pain evenly).

## Output Format
Return ONLY valid JSON matching this exact structure (no markdown, no explanation):

{
  "id": "plan-${year}-${month}",
  "month": ${month},
  "year": ${year},
  "homeSuburb": "${homeSuburb}",
  "blockedDays": ${JSON.stringify(blockedDays)},
  "days": [
    {
      "date": "YYYY-MM-DD",
      "stores": [
        {
          "storeId": "store-id-here",
          "order": 1,
          "estimatedArrival": "9:00 AM"
        }
      ],
      "isBlocked": false,
      "totalEstimatedDriveMin": 45
    }
  ],
  "generatedAt": "${new Date().toISOString()}"
}

Include ALL work days for the month (even if some have no visits — give them an empty stores array). Mark blocked days with isBlocked: true and empty stores array.

Estimate arrival times starting from 8:00 AM departure from home, with ~20-30 min per store visit and realistic drive times between suburbs.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8192,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        error: errorData.error?.message || `Anthropic API error: ${response.status}`,
      })
    }

    const data = await response.json()
    const content = data.content?.[0]?.text

    if (!content) {
      return res.status(500).json({ error: 'Empty response from AI' })
    }

    // Parse JSON from response (handle potential markdown wrapping)
    let planJson: string = content
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      planJson = jsonMatch[1]
    }

    const plan = JSON.parse(planJson.trim())
    return res.status(200).json(plan)
  } catch (err: any) {
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'Failed to parse AI response as JSON' })
    }
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
