from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    """Paginates list responses into the shape the frontend's PaginatedResponse<T> expects."""

    page_size = 20
    page_size_query_param = 'pageSize'
    max_page_size = 200
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'data': data,
            'pagination': {
                'page': self.page.number,
                'pageSize': self.get_page_size(self.request),
                'total': self.page.paginator.count,
                'totalPages': self.page.paginator.num_pages,
            },
        })
