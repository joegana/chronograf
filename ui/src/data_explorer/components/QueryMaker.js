import React, {PropTypes} from 'react'

import QueryBuilder from './QueryBuilder'
import QueryMakerTab from './QueryMakerTab'
import buildInfluxQLQuery from 'utils/influxql'
import classnames from 'classnames'

const {arrayOf, bool, func, node, number, shape, string} = PropTypes

const QueryMaker = React.createClass({
  propTypes: {
    source: shape({
      links: shape({
        queries: string.isRequired,
      }).isRequired,
    }).isRequired,
    queries: arrayOf(shape({})).isRequired,
    timeRange: shape({
      upper: string,
      lower: string,
    }).isRequired,
    isInDataExplorer: bool,
    actions: shape({
      chooseNamespace: func.isRequired,
      chooseMeasurement: func.isRequired,
      chooseTag: func.isRequired,
      groupByTag: func.isRequired,
      addQuery: func.isRequired,
      toggleField: func.isRequired,
      groupByTime: func.isRequired,
      toggleTagAcceptance: func.isRequired,
      applyFuncsToField: func.isRequired,
      editRawTextAsync: func.isRequired,
    }).isRequired,
    height: string,
    top: string,
    setActiveQueryIndex: func.isRequired,
    onDeleteQuery: func.isRequired,
    activeQueryIndex: number,
    children: node,
    layout: string,
  },

  render() {
    const {height, top, layout} = this.props
    return (
      <div
        className={classnames('query-maker', {
          'query-maker--panel': layout === 'panel',
        })}
        style={{height, top}}
      >
        {this.renderQueryTabList()}
        {this.renderQueryBuilder()}
      </div>
    )
  },

  renderQueryBuilder() {
    const {
      timeRange,
      actions,
      source,
      layout,
      isInDataExplorer,
      activeQuery,
      onAddQuery,
    } = this.props

    if (!activeQuery) {
      return (
        <div className="query-maker--empty">
          <h5>This Graph has no Queries</h5>
          <br />
          <div
            className="btn btn-primary"
            role="button"
            onClick={onAddQuery}
            data-test="add-query-button"
          >
            Add a Query
          </div>
        </div>
      )
    }

    // NOTE
    // the layout prop is intended to toggle between a horizontal and vertical layout
    // the layout will be horizontal by default
    // vertical layout is known as "panel" layout as it will be used to build
    // a "cell editor panel" though that term might change
    // Currently, if set to "panel" the only noticeable difference is that the
    // DatabaseList becomes DatabaseDropdown (more space efficient in vertical layout)
    // and is outside the container with measurements/tags/fields
    //
    // TODO:
    // - perhaps switch to something like "isVertical" and accept boolean instead of string
    // - more css/markup work to make the alternate appearance look good

    return (
      <QueryBuilder
        source={source}
        timeRange={timeRange}
        query={activeQuery}
        actions={actions}
        onAddQuery={onAddQuery}
        layout={layout}
        isInDataExplorer={isInDataExplorer}
      />
    )
  },

  renderQueryTabList() {
    const {
      queries,
      activeQueryIndex,
      onDeleteQuery,
      timeRange,
      setActiveQueryIndex,
      onAddQuery,
    } = this.props

    return (
      <div className="query-maker--tabs">
        {queries.map((q, i) => {
          return (
            <QueryMakerTab
              isActive={i === activeQueryIndex}
              key={i}
              queryIndex={i}
              query={q}
              onSelect={setActiveQueryIndex}
              onDelete={onDeleteQuery}
              queryTabText={
                q.rawText ||
                buildInfluxQLQuery(timeRange, q) ||
                `Query ${i + 1}`
              }
            />
          )
        })}
        {this.props.children}
        <div
          className="query-maker--new btn btn-sm btn-primary"
          onClick={onAddQuery}
          data-test="new-query-button"
        >
          <span className="icon plus" />
        </div>
      </div>
    )
  },
})

QueryMaker.defaultProps = {
  layout: 'default',
}
export default QueryMaker
