import fetch from '@/utils/fetch'
import moment from 'moment'

export function getMonthlySalesStats() {
  return fetch({
    url: '/stats/monthly_sales',
    method: 'get'
  })
}

export function getClientRankingStats(period) {
  if (period === 'alltime') {
    return fetch({
      url: '/stats/client_ranking/alltime',
      method: 'get'
    })
  } else {
    var startDate = null
    var endDate = new Date()
    endDate.setDate(endDate.getDate() + 1)
    var y = endDate.getFullYear()
    var m = endDate.getMonth()
    if (period === 'thisMonth') {
      startDate = new Date(y, m, 1)
    } else if (period === 'thisYear') {
      startDate = new Date(y, 0, 1)
    } else if (period === 'lastYear') {
      startDate = new Date(y - 1, 0, 1)
      endDate = new Date(y - 1, 11, 31)
    }

    return fetch({
      url: '/stats/client_ranking/' + moment(startDate).format('YYYY-MM-DD') + '/' + moment(endDate).format('YYYY-MM-DD'),
      method: 'get'
    })
  }
}

export function getDailySalesSummary() {
  return fetch({
    url: '/stats/daily_sales',
    method: 'get'
  })
}

export function getMonthlySalesCountTo() {
  return fetch({
    url: '/stats/monthly_sales/count_to',
    method: 'get'
  })
}
