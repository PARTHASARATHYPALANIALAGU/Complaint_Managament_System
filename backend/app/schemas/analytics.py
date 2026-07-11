from pydantic import BaseModel
from typing import List


class StatusCount(BaseModel):
    status: str
    count: int


class CategoryCount(BaseModel):
    category: str
    count: int


class SentimentCount(BaseModel):
    sentiment: str
    count: int


class MonthlyTrend(BaseModel):
    month: str
    count: int


class SummaryResponse(BaseModel):
    total: int
    pending: int
    in_progress: int
    resolved: int
    high_priority: int
